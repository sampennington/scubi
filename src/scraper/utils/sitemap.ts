import { XMLParser } from "fast-xml-parser"
import { fetchText, type Url, toOrigin } from "./http"

export async function discoverSitemapUrls(originOrUrl: string): Promise<string[]> {
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


