/* eslint-disable no-console */
import dotenv from 'dotenv'
import * as cheerio from "cheerio"
import type { ZodTypeAny } from "zod"
import { PlaywrightRenderer } from "./engines/playwright-renderer"
import { llmExtractBlocks } from "./ai"

import {
  SiteScrapeSchema,
  ScrapedPageSchema,
  ColorPaletteSchema,
  FontsSchema,
  type SiteScrape,
  type ScrapedPage,
} from "@/scraper/models"

import { normalizeUrl, fetchText, toOrigin, type Url } from "@/scraper/utils/http"
import { loadRobots } from "@/scraper/utils/robots"
import { getUrls } from "@/scraper/utils/sitemap"
import { collectStylesheetUrls, extractFontFamiliesAndSources, isNonSystemFont, pickPalette, scoreColorsFromCss } from "@/scraper/utils/css"
import { extractSeoMeta, extractPlainText, extractImages as extractPageImages } from "@/scraper/utils/html"
import { extractBusinessProfile } from "@/scraper/utils/business"
import { writeJsonToTmpScrapes } from "@/scraper/utils/files"
import { BlockSchemas } from "@/components/blocks/schemas"
import { info } from "@/scraper/utils/logger"

dotenv.config({ path: '.env.local' })

const DEFAULT_MAX_PAGES = 40

function toSlug(u: Url): string {
  const p = new URL(u).pathname
  return p === "" ? "/" : p
}

async function scrapePage(url: Url, renderer: PlaywrightRenderer): Promise<ScrapedPage> {
  const rendered = await renderer.render(url)
  const html = rendered.html
  if (!html) {
    return ScrapedPageSchema.parse({
      url,
      slug: new URL(url).pathname || "/",
      title: undefined,
      html: undefined,
      text: undefined,
      sections: [],
      blockCandidates: [],
      images: [],
      seo: {}
    })
  }

  const $ = cheerio.load(html)
  const title = $("title").first().text().trim() || $("h1").first().text().trim()
  const text = extractPlainText($)
  const images = extractPageImages($, url)
  const seo = extractSeoMeta($)

  const { blocks, sections } = await llmExtractBlocks({ url, text, html })


  return ScrapedPageSchema.parse({
    url,
    slug: new URL(url).pathname || "/",
    title,
    html,
    text,
    sections,
    blockCandidates: blocks,
    images,
    seo,
    ai: { blocks, sections }
  })
}

export async function scrapeSite(targetUrl: Url): Promise<SiteScrape> {
  const origin = toOrigin(targetUrl)

  const { urls, sitemapUrls } = await getUrls(targetUrl, DEFAULT_MAX_PAGES)

  // Render home and compute colors/fonts from real CSS
  const homeUrl = urls.has(origin) ? origin : targetUrl
  let colors = ColorPaletteSchema.parse({ palette: [] })
  let fonts = FontsSchema.parse({ families: [], sources: [] })
  let renderCssSample: string[] = []
  let business: ReturnType<typeof extractBusinessProfile> | undefined
  try {
    info("Rendering home page", { homeUrl })
    const previewRenderer = new PlaywrightRenderer()
    const rendered = await previewRenderer.render(homeUrl)
    const $home = cheerio.load(rendered.html)

    const cssUrls = [...new Set([...collectStylesheetUrls($home, homeUrl, normalizeUrl), ...rendered.cssUrls])]
    const cssTexts = (await Promise.all(cssUrls.map(fetchText))).filter((t): t is string => !!t)
    renderCssSample = cssTexts.slice(0, 3)

    const colorOrder = scoreColorsFromCss(cssTexts)
    colors = pickPalette(colorOrder)

    const { families, sources } = extractFontFamiliesAndSources($home, cssTexts)
    const ordered = families.filter((f) => isNonSystemFont(f))
    fonts = FontsSchema.parse({
      heading: ordered[0],
      body: ordered.find((f) => f !== ordered[0]),
      families: ordered.slice(0, 8),
      sources
    })

    business = extractBusinessProfile($home, homeUrl)
    await previewRenderer.close()
    info("Home page rendered", { primary: colors.primary, headingFont: fonts.heading, bodyFont: fonts.body })
  } catch { }

  const chosenUrls = [homeUrl] // [...urls].slice(0, DEFAULT_MAX_PAGES)
  const renderer = new PlaywrightRenderer()

  info("Scraping page", { url: homeUrl })
  const pages: ScrapedPage[] = [await scrapePage(homeUrl, renderer)] // for (const u of urls) pages.push(await scrapePage(u, renderer))
  await renderer.close()

  const tree = chosenUrls
    .sort((a, b) => toSlug(a).localeCompare(toSlug(b)))
    .map((u) => ({ url: u, title: pages.find((p) => p.url === u)?.title }))

  const resultSeed = {
    targetUrl,
    crawledAt: new Date(),
    colors,
    fonts,
    business,
    sitemap: tree.map((n) => ({ url: n.url, title: n.title, children: [] as [] })),
    pages,
    rawCssUrls: [],
    robotsTxt: (await loadRobots(origin)).robots ?? undefined,
    sitemapXmlUrls: sitemapUrls,
    errors: [],
    renderCssSample
  }
  const result = SiteScrapeSchema.parse(resultSeed)
  info("Scrape complete", { pages: result.pages.length })

  // Write a full dump of the SiteScrape result for inspection
  const fullPath = writeJsonToTmpScrapes(
    `${new URL(targetUrl).hostname}-${Date.now()}-full.json`,
    result
  )

  // Write only OpenAI-contributed content for quick review
  const openAiOnly = {
    targetUrl: result.targetUrl,
    pages: result.pages.map((p: ScrapedPage) => ({
      url: p.url,
      slug: p.slug,
      llmBlocks: p.ai?.llmBlocks ?? []
    }))
  }
  const openAiPath = writeJsonToTmpScrapes(
    `${new URL(targetUrl).hostname}-${Date.now()}-openai.json`,
    openAiOnly
  )

  const leftovers = {
    targetUrl: result.targetUrl,
    sitemap: result.sitemap,
    pages: result.pages.map((p: ScrapedPage) => ({
      url: p.url,
      slug: p.slug,
      sections: p.sections,
      images: p.images,
      seo: p.seo,
      unmapped: (p.blockCandidates || []).filter((c: { type: string; content: unknown }) => {
        const schema = (BlockSchemas as Record<string, ZodTypeAny>)[c.type as string]
        if (!schema) return true
        return !schema.safeParse(c.content).success
      })
    }))
  }

  const leftoversPath = writeJsonToTmpScrapes(
    `${new URL(targetUrl).hostname}-${Date.now()}.json`,
    leftovers
  )

  // Log file locations for convenience
  info("Wrote scrape outputs", { fullPath, openAiPath, leftoversPath })

  return result
}

if (require.main === module) {
  const url = process.argv[2]
  if (!url) {
    console.error("Usage: npx tsx src/scraper/index.ts https://example.com")
    process.exit(1)
  }
  scrapeSite(url)
    .then((res) => {
      info("Scrape finished. Set SCRAPER_PRINT_JSON=true to print JSON to stdout.")
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
