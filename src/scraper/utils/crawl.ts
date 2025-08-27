import { fetchText, normalizeUrl, toOrigin, type Url } from "./http"
import { loadRobots } from "./robots"
import * as cheerio from "cheerio"

export async function crawl(startUrl: Url, maxPages: number): Promise<string[]> {
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
