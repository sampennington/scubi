import { XMLParser } from "fast-xml-parser"
import { fetchText, type Url, toOrigin } from "./http"
import { crawl } from "./crawl"

export async function getSitemapUrls(originOrUrl: string): Promise<string[]> {
  const origin = originOrUrl.startsWith("http") ? toOrigin(originOrUrl as Url) : originOrUrl
  const robotsTxt = await fetchText(`${origin}/robots.txt`)
  const urls: string[] = []

  if (robotsTxt) {
    for (const line of robotsTxt.split("\n")) {
      const m = line.match(/sitemap:\s*(.+)$/i)
      if (m?.[1]) urls.push(m[1].trim())
    }
  }
  const fallback = `${origin}/sitemap.xml`
  if (!urls.includes(fallback)) urls.push(fallback)
  return urls
}

export async function parseSitemapXmlText(xml: string): Promise<string[]> {
  const parser = new XMLParser({ ignoreAttributes: false })
  const data = parser.parse(xml)
  const urls: string[] = []
  if (data?.urlset?.url) {
    const items = Array.isArray(data.urlset.url) ? data.urlset.url : [data.urlset.url]
    for (const it of items) if (it?.loc) urls.push(String(it.loc))
  }
  if (data?.sitemapindex?.sitemap) {
    const items = Array.isArray(data.sitemapindex.sitemap) ? data.sitemapindex.sitemap : [data.sitemapindex.sitemap]
    for (const it of items) if (it?.loc) urls.push(String(it.loc))
  }
  return urls
}


export async function getUrls(targetUrl: string, maxPages: number): Promise<{ urls: Set<string>; sitemapUrls: string[] }> {
  const origin = toOrigin(targetUrl)

  const sitemapUrls = await getSitemapUrls(origin)
  const urls = new Set<string>()
  const fetchedSitemaps: string[] = []

  for (const url of sitemapUrls) {
    const xml = await fetchText(url)
    if (!xml) continue
    fetchedSitemaps.push(url)
    const xmlUrls = await parseSitemapXmlText(xml)
    for (const u of xmlUrls) urls.add(u)
  }

  if (urls.size === 0) {
    const crawled = await crawl(targetUrl, maxPages)
    for (const u of crawled) urls.add(u)
  }

  return {
    urls,
    sitemapUrls
  }
}