/* eslint-disable no-console */
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
  type LlmBlockCandidate
} from "@/scraper/models"

import { normalizeUrl, fetchText, toOrigin, type Url } from "@/scraper/utils/http"
import { loadRobots } from "@/scraper/utils/robots"
import { discoverSitemapUrls, parseSitemapXmlText } from "@/scraper/utils/sitemap"
import { collectStylesheetUrls, extractFontFamiliesAndSources, scoreColorsFromCss } from "@/scraper/utils/css"
import { extractSeoMeta, extractPlainText, extractImages as extractPageImages } from "@/scraper/utils/html"
import { inferSections } from "@/scraper/utils/sections"
import { mapSectionsToBlockCandidates } from "@/scraper/utils/mapper"
import { writeJsonToTmpScrapes } from "@/scraper/utils/files"
import { BlockSchemas } from "@/components/blocks/schemas"

const DEFAULT_MAX_PAGES = 40

function pickPalette(sortedColors: string[]) {
  const primary = sortedColors[0]
  const secondary = sortedColors.find((c) => c !== primary)
  const background = sortedColors.find((c) => (c.includes("rgb") || c.includes("hsl")) ? false : c.length >= 4)
  return ColorPaletteSchema.parse({
    primary,
    secondary,
    background,
    accent: sortedColors[2],
    palette: sortedColors.slice(0, 12)
  })
}

function isNonSystemFont(f: string): boolean {
  const sys = ["arial", "helvetica", "sans-serif", "serif", "system-ui", "ui-sans-serif", "times new roman"]
  return !sys.includes(f.toLowerCase())
}

function toSlug(u: Url): string {
  const p = new URL(u).pathname
  return p === "" ? "/" : p
}

async function crawl(startUrl: Url, maxPages = DEFAULT_MAX_PAGES): Promise<string[]> {
  const origin = toOrigin(startUrl)
  const { isAllowed } = await loadRobots(origin)

  const queue: string[] = [startUrl]
  const visited = new Set<string>()
  const result: string[] = []

  while (queue.length && result.length < maxPages) {
    const url = queue.shift() as string
    if (visited.has(url)) continue
    visited.add(url)
    if (!isAllowed(url)) continue

    const html = await fetchText(url)
    if (!html) continue
    result.push(url)

    const $ = cheerio.load(html)
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") ?? ""
      const u = normalizeUrl(url, href)
      if (u && !visited.has(u) && u.startsWith(origin)) {
        queue.push(u)
      }
    })
  }
  return result
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
  const sections = inferSections($)
  const images = extractPageImages($, url)
  const seo = extractSeoMeta($)
  const blockCandidates = mapSectionsToBlockCandidates(sections)

  let llmBlocks: LlmBlockCandidate[] = []
  try {
    llmBlocks = await llmExtractBlocks({ url, text, html })
  } catch { }

  return ScrapedPageSchema.parse({
    url,
    slug: new URL(url).pathname || "/",
    title,
    html,
    text,
    sections,
    blockCandidates: [
      ...blockCandidates,
      ...llmBlocks.map((b) => ({ type: b.type, content: b.content, sourceSectionType: b.sourceSectionType }))
    ],
    images,
    seo
  })
}

export async function scrapeSite(targetUrl: Url): Promise<SiteScrape> {
  const origin = toOrigin(targetUrl)

  // Sitemap discovery or fallback crawl
  const sitemapUrls = await discoverSitemapUrls(origin)
  const candidatePageUrls = new Set<string>()
  const fetchedSitemaps: string[] = []
  for (const smUrl of sitemapUrls) {
    const xml = await fetchText(smUrl)
    if (!xml) continue
    fetchedSitemaps.push(smUrl)
    const urls = await parseSitemapXmlText(xml)
    for (const u of urls) candidatePageUrls.add(u)
  }
  if (candidatePageUrls.size === 0) {
    const crawled = await crawl(targetUrl, DEFAULT_MAX_PAGES)
    for (const u of crawled) candidatePageUrls.add(u)
  }

  // Render home and compute colors/fonts from real CSS
  const homeUrl = candidatePageUrls.has(origin) ? origin : targetUrl
  let colors = ColorPaletteSchema.parse({ palette: [] })
  let fonts = FontsSchema.parse({ families: [], sources: [] })
  let renderCssSample: string[] = []
  try {
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
    await previewRenderer.close()
  } catch { }

  // Scrape pages
  const urls = [...candidatePageUrls].slice(0, DEFAULT_MAX_PAGES)
  const renderer = new PlaywrightRenderer()
  const pages: ScrapedPage[] = []
  for (const u of urls) pages.push(await scrapePage(u, renderer))
  await renderer.close()

  // Simple sitemap tree
  const tree = urls
    .sort((a, b) => toSlug(a).localeCompare(toSlug(b)))
    .map((u) => ({ url: u, title: pages.find((p) => p.url === u)?.title }))

  const result = SiteScrapeSchema.parse({
    targetUrl,
    crawledAt: new Date(),
    colors,
    fonts,
    sitemap: tree.map((n) => ({ url: n.url, title: n.title, children: [] })),
    pages,
    rawCssUrls: [],
    robotsTxt: (await loadRobots(origin)).robots ?? undefined,
    sitemapXmlUrls: fetchedSitemaps,
    errors: [],
    renderCssSample
  })

  // Save leftovers for manual review
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
  writeJsonToTmpScrapes(`${new URL(targetUrl).hostname}-${Date.now()}.json`, leftovers)

  return result
}

// CLI entry
if (require.main === module) {
  const url = process.argv[2]
  if (!url) {
    console.error("Usage: npx tsx src/scraper/index.ts https://example.com")
    process.exit(1)
  }
  scrapeSite(url)
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
