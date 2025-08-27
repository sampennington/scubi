import { chromium } from "playwright"

export type RenderResult = {
  html: string
  screenshotPng?: string
  cssUrls: string[]
  computedFonts: { h1: string[]; h2: string[]; body: string[] }
}

export async function renderPage(url: string): Promise<RenderResult> {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ userAgent: "scubi-scraper/1.0" })
  const cssUrls = new Set<string>()

  page.on("response", (res) => {
    const ct = res.headers()["content-type"] || ""
    if (ct.includes("text/css")) cssUrls.add(res.url())
  })

  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 })
  const html = await page.content()

  const screenshot = await page.screenshot({ type: "png" })
  const screenshotPng = `data:image/png;base64,${screenshot.toString("base64")}`

  const computedFonts = await page.evaluate(() => {
    const uniq = (arr: string[]) => [...new Set(arr.map((s) => s.toLowerCase()))]
    const fam = (el: Element) =>
      getComputedStyle(el)
        .fontFamily.split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean)
    const h1 = Array.from(document.querySelectorAll("h1")).flatMap(fam)
    const h2 = Array.from(document.querySelectorAll("h2")).flatMap(fam)
    const body = fam(document.body)
    return { h1: uniq(h1), h2: uniq(h2), body: uniq(body) }
  })

  await browser.close()
  return { html, screenshotPng, cssUrls: [...cssUrls], computedFonts }
}
