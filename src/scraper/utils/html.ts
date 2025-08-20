import type * as cheerio from "cheerio"
import type { AnyNode } from "domhandler"
import { SeoMetaSchema } from "@/scraper/models"

export function extractPlainText($: cheerio.CheerioAPI): string {
  $("script, style, noscript").remove()
  return $("body").text().replace(/\s+/g, " ").trim()
}

export function extractSeoMeta($: cheerio.CheerioAPI) {
  const title = $("head > title").first().text().trim() || $("h1").first().text().trim()
  const description = $('meta[name="description"]').attr("content") || ""
  const canonical = $('link[rel="canonical"]').attr("href")
  const robots = $('meta[name="robots"]').attr("content")
  const og = {
    title: $('meta[property="og:title"]').attr("content"),
    description: $('meta[property="og:description"]').attr("content"),
    image: $('meta[property="og:image"]').attr("content"),
    type: $('meta[property="og:type"]').attr("content"),
    url: $('meta[property="og:url"]').attr("content")
  }
  const twitter = {
    card: $('meta[name="twitter:card"]').attr("content"),
    title: $('meta[name="twitter:title"]').attr("content"),
    description: $('meta[name="twitter:description"]').attr("content"),
    image: $('meta[name="twitter:image"]').attr("content")
  }
  const jsonLd: unknown[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    const t = $(el).contents().text()
    if (t) {
      try {
        const parsed = JSON.parse(t)
        jsonLd.push(parsed)
      } catch { }
    }
  })
  return SeoMetaSchema.parse({ title, description, canonical, robots, og, twitter, jsonLd })
}

export type PageSection = {
  type: string
  selector?: string
  heading?: string
  textSample?: string
  images: string[]
}

export function getSelector($el: cheerio.Cheerio<AnyNode>): string {
  const id = $el.attr("id")
  if (id) return `#${id}`
  const cls = $el.attr("class")
  const node = $el.get(0) as (AnyNode & { name?: string; tagName?: string })
  const tag = node?.name ?? node?.tagName ?? "div"
  if (cls) return `${tag}.${cls.split(" ").slice(0, 2).join(".")}`
  return tag
}

export function extractImages($: cheerio.CheerioAPI, pageUrl: string) {
  const images: { src: string; alt?: string; context: "img" | "background"; pageUrl: string }[] = []
  $("img").each((_, el) => {
    const src = $(el).attr("src")
    if (src) images.push({ src, alt: $(el).attr("alt") ?? "", context: "img", pageUrl })
  })
  $('[style*="background"]').each((_, el) => {
    const style = $(el).attr("style") ?? ""
    const m = style.match(/background(?:-image)?:[^;]*url\((['"]?)(.*?)\1\)/i)
    if (m?.[2]) images.push({ src: m[2], context: "background", pageUrl })
  })
  return images
}


