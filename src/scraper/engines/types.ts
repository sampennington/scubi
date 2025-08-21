export type RenderedPage = {
  html: string
  cssUrls: string[]
  screenshotPng?: string
  lowQScreenShotbase64?: string
  lowQScreenShot?: Buffer
}

export interface Renderer {
  render(url: string): Promise<RenderedPage>
  close(): Promise<void>
}
