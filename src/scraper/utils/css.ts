import type { Url } from "./http"
import * as cheerio from "cheerio"

// Regexes for extracting color values
const HEX = /#(?:[0-9a-fA-F]{3,8})\b/g
const RGB = /rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/g
const RGBA = /rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(?:0?\.\d+|1|0)\s*\)/g
const HSL = /hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)/g

export function scoreColorsFromCss(cssList: string[]): string[] {
  const counts = new Map<string, number>()
  for (const css of cssList) {
    const matches = [
      ...(css.match(HEX) ?? []),
      ...(css.match(RGB) ?? []),
      ...(css.match(RGBA) ?? []),
      ...(css.match(HSL) ?? [])
    ]
    for (const m of matches) {
      const color = m.toLowerCase()
      if (["#fff", "#ffffff", "#000", "#000000", "rgba(0,0,0,0)"].includes(color)) continue
      counts.set(color, (counts.get(color) ?? 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c)
}

export function collectStylesheetUrls($: cheerio.CheerioAPI, baseUrl: Url, normalize: (base: Url, href: string) => string | null): string[] {
  const urls = new Set<string>()
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr("href")
    const u = normalize(baseUrl, href ?? "")
    if (u) urls.add(u)
  })
  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr("href")
    const u = normalize(baseUrl, href ?? "")
    if (u) urls.add(u)
  })
  return [...urls]
}

export function extractFontFamiliesAndSources($: cheerio.CheerioAPI, cssTexts: string[]) {
  const families = new Set<string>()
  const sources = new Set<string>()

  $('[style*="font-family"]').each((_, el) => {
    const style = ($(el).attr("style") ?? "").toLowerCase()
    const m = style.match(/font-family:\s*([^;]+)/)
    if (m?.[1]) splitFontList(m[1]).forEach((f) => families.add(f))
  })

  for (const css of cssTexts) {
    for (const m of css.matchAll(/font-family:\s*([^;{}]+);/g)) {
      const fams = m[1]
      if (fams) splitFontList(fams).forEach((f) => families.add(f))
    }
    for (const s of css.matchAll(/src:\s*[^;]*url\((['"]?)(.*?)\1\)/g)) {
      const url = s[2]
      if (url) sources.add(url)
    }
  }

  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr("href")
    if (href) sources.add(href)
    const fam = new URL(href ?? "", "https://example.com").searchParams.get("family")
    if (fam) fam.split(":")[0].split("&").forEach((f) => families.add(f.replace(/\+/g, " ")))
  })

  return { families: [...families], sources: [...sources] }
}

function splitFontList(val: string): string[] {
  return val
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean)
}


