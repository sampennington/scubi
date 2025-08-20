import { chromium, type Response, type Browser, type Page } from "playwright"
import type { Renderer, RenderedPage } from "./types"

type PlaywrightRendererOptions = {
  userAgent?: string
  timeoutMs?: number
  blockResources?: (url: string) => boolean
}

const DEFAULT_UA = "scubi-scraper/1.0"

export class PlaywrightRenderer implements Renderer {
  private browser!: Browser
  private page!: Page
  private readonly ua: string
  private readonly timeoutMs: number
  private readonly shouldBlock: (url: string) => boolean

  constructor(opts?: PlaywrightRendererOptions) {
    this.ua = opts?.userAgent ?? DEFAULT_UA
    this.timeoutMs = opts?.timeoutMs ?? 45_000
    this.shouldBlock =
      opts?.blockResources ??
      ((url) => /googletagmanager|google-analytics|doubleclick|hotjar|facebook|segment|sentry/i.test(url))
  }

  async init() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: true })
      this.page = await this.browser.newPage({ userAgent: this.ua })
      await this.page.route("**/*", (route) => {
        const req = route.request()
        const url = req.url()
        if (this.shouldBlock(url) && ["image", "media", "font", "stylesheet", "script"].includes(req.resourceType())) {
          return route.abort()
        }
        return route.continue()
      })
    }
  }

  async render(url: string): Promise<RenderedPage> {
    await this.init()

    const cssUrls = new Set<string>()
    const onResponse = (res: Response) => {
      try {
        const headers = typeof res.headers === "function" ? res.headers() : {}
        const url = typeof res.url === "function" ? res.url() : ""
        const ct = (headers?.["content-type"] ?? "") as string
        if (ct.includes("text/css")) cssUrls.add(url)
      } catch { }
    }

    this.page.on("response", onResponse)

    await this.page.goto(url, { waitUntil: "networkidle", timeout: this.timeoutMs })
    const html = await this.page.content()
    const screenshot = await this.page.screenshot({ type: "png" })
    const screenshotPng = `data:image/png;base64,${screenshot.toString("base64")}`

    this.page.off("response", onResponse)
    return { html, cssUrls: [...cssUrls].filter(Boolean), screenshotPng }
  }

  async close(): Promise<void> {
    try {
      await this.page?.close()
    } catch { }
    try {
      await this.browser?.close()
    } catch { }
  }
}


