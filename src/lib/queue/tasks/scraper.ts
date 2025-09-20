import { scrapeSite } from "@/scraper"
import type { TaskDefinition, TaskJobData } from "../types"
import type { ScrapedSiteData } from "@/app/api/scrape-domain/route"
import type { SiteScrape } from "@/scraper/models"

export interface ScraperTaskData extends TaskJobData {
  domain: string
  shopId?: string
}

export interface ScraperTaskResult {
  success: boolean
  data?: ScrapedSiteData
  error?: string
  domain: string
}

function convertSiteScrapeToShopData(siteScrape: SiteScrape, domain: string): ScrapedSiteData {
  const business = siteScrape.business
  const colors = siteScrape.colors

  return {
    name:
      business?.name ||
      `${domain
        .split(".")[0]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase())} Dive Center`,
    description:
      business?.description ||
      siteScrape.pages?.[0]?.seo?.description ||
      "Professional diving services and training center.",
    address: business?.address,
    phoneNumber: business?.phoneNumber,
    email: business?.email,
    facebookUrl: business?.social?.facebook,
    instagramUrl: business?.social?.instagram,
    whatsappUrl: business?.social?.whatsapp,
    logoUrl: business?.logoUrl,
    faviconUrl: business?.faviconUrl,
    primaryColor: colors.primary || "#2563eb",
    secondaryColor: colors.secondary || "#64748b",
    accentColor: colors.accent || "#0891b2",
    images:
      siteScrape.pages
        ?.flatMap((page) =>
          (page.images || []).map((img) => (typeof img === "string" ? img : img.src))
        )
        .slice(0, 10) || [],
    pages:
      siteScrape.pages?.map((page) => ({
        title: page.title || "Untitled Page",
        url: page.url,
        content: page.text?.slice(0, 500) || ""
      })) || []
  }
}

export const scraperTaskDefinition: TaskDefinition<ScraperTaskData, ScraperTaskResult> = {
  queueName: "website-scraper",
  processor: async ({ data, updateProgress }) => {
    const { domain } = data

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => {
          reject(new Error(`Scraping timeout after 5 minutes for domain: ${domain}`))
        },
        5 * 60 * 1000 // 5 minutes timeout
      )
    })

    try {
      await updateProgress({
        percentage: 10,
        current: 1,
        total: 5,
        message: "Initializing website scraper..."
      })

      const normalizedDomain = domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/$/, "")

      const fullUrl = `https://${normalizedDomain}`

      await updateProgress({
        percentage: 30,
        current: 2,
        total: 5,
        message: "Analyzing website structure..."
      })

      const siteScrape = await Promise.race([scrapeSite(fullUrl), timeoutPromise])

      await updateProgress({
        percentage: 70,
        current: 4,
        total: 5,
        message: "Processing extracted data..."
      })

      const shopData = convertSiteScrapeToShopData(siteScrape, normalizedDomain)

      await updateProgress({
        percentage: 85,
        current: 4.5,
        total: 5,
        message: `Extracted colors: ${shopData.primaryColor}, ${shopData.secondaryColor}, ${shopData.accentColor}`,
        partialResult: {
          primaryColor: shopData.primaryColor,
          secondaryColor: shopData.secondaryColor,
          accentColor: shopData.accentColor
        }
      })

      await updateProgress({
        percentage: 100,
        current: 5,
        total: 5,
        message: "Website analysis complete!"
      })

      return {
        success: true,
        data: shopData,
        domain: normalizedDomain
      }
    } catch (error) {
      console.error("Scraper task failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        domain
      }
    }
  }
}
