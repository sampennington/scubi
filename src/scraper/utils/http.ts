export type Url = string

export const SCRAPER_USER_AGENT = "scubi-scraper/1.0"

export async function httpGet(url: Url): Promise<Response> {
  return fetch(url, { headers: { "User-Agent": SCRAPER_USER_AGENT } })
}

export function toOrigin(u: Url): string {
  const { origin } = new URL(u)
  return origin
}

export function normalizeUrl(base: Url, href: string): Url | null {
  if (!href) return null
  try {
    const url = new URL(href, base)
    return url.origin === toOrigin(base) ? url.href.split("#")[0] : null
  } catch {
    return null
  }
}

export async function fetchText(url: Url): Promise<string | null> {
  try {
    const res = await httpGet(url)
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}
