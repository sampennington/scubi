import robotsParser from "robots-parser"
import { fetchText, type Url, toOrigin } from "./http"

export async function loadRobots(originOrUrl: string) {
  const origin = originOrUrl.startsWith("http") ? toOrigin(originOrUrl as Url) : originOrUrl
  const robotsUrl = `${origin}/robots.txt`
  const text = await fetchText(robotsUrl)
  if (!text) return { robots: null as string | null, isAllowed: (_: Url) => true }
  const parser = robotsParser(robotsUrl, text)
  return {
    robots: text,
    isAllowed: (u: Url) => parser.isAllowed(u, "scubi-scraper/1.0") !== false
  }
}


