import type * as cheerio from "cheerio"
import { BusinessProfileSchema, type BusinessProfile } from "@/scraper/models"

function pick<T>(...vals: Array<T | undefined>): T | undefined {
  for (const v of vals) if (v !== undefined && v !== null && String(v).trim() !== "") return v as T
  return undefined
}

export function extractBusinessProfile($: cheerio.CheerioAPI, originUrl: string): BusinessProfile {
  const origin = new URL(originUrl)

  const jsonLd: unknown[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    const t = $(el).contents().text()
    if (!t) return
    try {
      const parsed = JSON.parse(t)
      if (Array.isArray(parsed)) (jsonLd as unknown[]).push(...parsed)
      else (jsonLd as unknown[]).push(parsed)
    } catch { }
  })

  type OrgLike = {
    "@type"?: string | string[]
    logo?: string | { url?: string }
    address?: string | {
      streetAddress?: string
      addressLocality?: string
      addressRegion?: string
      postalCode?: string
      addressCountry?: string
    }
    openingHours?: string[]
    openingHoursSpecification?: Array<{ dayOfWeek?: string; opens?: string; closes?: string }>
    geo?: { latitude?: number | string; longitude?: number | string }
    sameAs?: string[]
    name?: string
    description?: string
    url?: string
    telephone?: string
    email?: string
  }

  const org = (jsonLd.find((n) => {
    if (typeof n !== "object" || n === null) return false
    const t = (n as Record<string, unknown>)["@type"]
    return /Organization|LocalBusiness/i.test(String(t))
  }) as OrgLike) || ({} as OrgLike)

  const logoFromJson = typeof org.logo === "string" ? org.logo : (org.logo?.url as string | undefined)
  const addressFromJson = org.address
    ? typeof org.address === "string"
      ? org.address
      : [org.address.streetAddress, org.address.addressLocality, org.address.addressRegion, org.address.postalCode, org.address.addressCountry]
        .filter(Boolean)
        .join(", ")
    : undefined
  const openingHoursFromJson: string[] = Array.isArray(org.openingHours)
    ? org.openingHours
    : Array.isArray(org.openingHoursSpecification)
      ? org.openingHoursSpecification.map((s) => `${s.dayOfWeek ?? ""} ${s.opens ?? ""}-${s.closes ?? ""}`.trim())
      : []
  const geoFromJson = org.geo && (org.geo.latitude || org.geo.longitude)
    ? { lat: Number(org.geo.latitude), lng: Number(org.geo.longitude) }
    : undefined
  // sameAs not used currently

  // Meta/link
  const canonical = $('link[rel="canonical"]').attr("href")
  const siteName = $('meta[property="og:site_name"]').attr("content")
  const ogTitle = $('meta[property="og:title"]').attr("content")
  const titleTag = $("title").first().text().trim()
  const logoLink = $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href") || $('link[rel="apple-touch-icon"]').attr("href")

  // Contact anchors
  const tel = $('a[href^="tel:"]').first().attr("href")?.replace(/^tel:/, "")
  const mail = $('a[href^="mailto:"]').first().attr("href")?.replace(/^mailto:/, "")

  // Social links
  const social: Record<string, string | undefined> = {
    instagram: undefined,
    facebook: undefined,
    twitter: undefined,
    youtube: undefined,
    tiktok: undefined,
    linkedin: undefined,
    whatsapp: undefined
  }
  $('a[href]').each((_, el) => {
    const href = $(el).attr("href") || ""
    if (/instagram\.com/i.test(href)) social.instagram = href
    else if (/facebook\.com/i.test(href)) social.facebook = href
    else if (/(x\.com|twitter\.com)/i.test(href)) social.twitter = href
    else if (/youtube\.com|youtu\.be/i.test(href)) social.youtube = href
    else if (/tiktok\.com/i.test(href)) social.tiktok = href
    else if (/linkedin\.com/i.test(href)) social.linkedin = href
    else if (/wa\.me|api\.whatsapp\.com/i.test(href)) social.whatsapp = href
  })

  const profile: BusinessProfile = {
    name: pick(org.name as string | undefined, siteName, ogTitle, titleTag),
    description: pick(org.description as string | undefined),
    websiteUrl: pick(org.url as string | undefined, canonical, origin.origin),
    logoUrl: pick(logoFromJson, logoLink),
    faviconUrl: pick(logoLink),
    phoneNumber: pick(org.telephone as string | undefined, tel),
    email: pick(org.email as string | undefined, mail),
    address: pick(addressFromJson),
    openingHours: openingHoursFromJson,
    geo: geoFromJson,
    social
  }

  return BusinessProfileSchema.parse(profile)
}


