export type RenderedPage = {
  html: string
  cssUrls: string[]
  screenshotPng?: string
}

export interface Renderer {
  render(url: string): Promise<RenderedPage>
  close(): Promise<void>
}


