"use server"

import { chromium } from "playwright"
import { db } from "@/database/db"
import { reviews } from "@/database/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

interface ScrapedReview {
  reviewerName: string
  reviewerPhoto?: string
  rating: number
  reviewText: string
  reviewDate: string
  verified: boolean
  helpfulCount?: number
  reviewUrl?: string
}

export async function scrapeGoogleMapsReviews(
  shopId: string,
  mapsUrl: string
): Promise<{ success: boolean; error?: string; reviewsCount?: number }> {
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    })

    await page.goto(mapsUrl, { waitUntil: "networkidle", timeout: 30000 })

    try {
      await page.waitForSelector('[data-value="Reviews"]', { timeout: 10000 })
      await page.click('[data-value="Reviews"]')
      await page.waitForTimeout(2000)
    } catch {
      try {
        await page.click('button[aria-label*="reviews"]')
        await page.waitForTimeout(2000)
      } catch {}
    }

    await page.evaluate(async () => {
      const scrollContainer = document.querySelector('[role="main"]') || document.body
      for (let i = 0; i < 5; i++) {
        scrollContainer.scrollBy(0, 1000)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    })

    const scrapedReviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll(
        '[data-review-id], .jftiEf, [jsaction*="review"]'
      )
      const reviews: ScrapedReview[] = []

      reviewElements.forEach((reviewEl) => {
        try {
          const nameElement =
            reviewEl.querySelector(".d4r55, .TSUbDb") ||
            reviewEl
              .querySelector('[data-value*="Local Guide"]')
              ?.parentElement?.querySelector("div")
          const reviewerName = nameElement?.textContent?.trim()

          const photoElement = reviewEl.querySelector('img[src*="googleusercontent"], .NBa7we img')
          const reviewerPhoto = photoElement?.getAttribute("src") || undefined

          const starsContainer = reviewEl.querySelector(".kvMYJc, .DU9Pgb")
          const filledStars =
            starsContainer?.querySelectorAll(
              '[style*="color: rgb(251, 188, 4)"], .gold, .lTi8oc.z3HNkc'
            ).length || 0
          const rating = filledStars > 0 ? filledStars : 5 // Default to 5 if can't parse

          const textElement =
            reviewEl.querySelector(".MyEned, .wiI7pd") ||
            reviewEl.querySelector("[data-expandable-section]")
          const reviewText = textElement?.textContent?.trim()

          const dateElement = reviewEl.querySelector(".rsqaWe, .p34Wcf")
          const dateText = dateElement?.textContent?.trim()

          let reviewDate = new Date().toISOString()
          if (dateText?.includes("day")) {
            const days = parseInt(dateText.match(/(\d+)/)?.[1] || "1")
            const date = new Date()
            date.setDate(date.getDate() - days)
            reviewDate = date.toISOString()
          } else if (dateText?.includes("week")) {
            const weeks = parseInt(dateText.match(/(\d+)/)?.[1] || "1")
            const date = new Date()
            date.setDate(date.getDate() - weeks * 7)
            reviewDate = date.toISOString()
          } else if (dateText?.includes("month")) {
            const months = parseInt(dateText.match(/(\d+)/)?.[1] || "1")
            const date = new Date()
            date.setMonth(date.getMonth() - months)
            reviewDate = date.toISOString()
          }

          const verified = !!reviewEl.querySelector('[data-value*="Local Guide"]')

          if (reviewerName && reviewText && rating > 0) {
            reviews.push({
              reviewerName,
              reviewerPhoto,
              rating,
              reviewText,
              reviewDate,
              verified,
              helpfulCount: 0
            })
          }
        } catch (error) {
          console.error("Error parsing review:", error)
        }
      })

      return reviews
    })

    await browser.close()

    if (scrapedReviews.length === 0) {
      return { success: false, error: "No reviews found on this page" }
    }

    let savedCount = 0
    for (const review of scrapedReviews) {
      try {
        const existing = await db
          .select()
          .from(reviews)
          .where(eq(reviews.reviewerName, review.reviewerName))
          .limit(1)

        if (existing.length === 0) {
          await db.insert(reviews).values({
            id: nanoid(),
            shopId,
            platform: "google",
            reviewerName: review.reviewerName,
            reviewerPhoto: review.reviewerPhoto,
            rating: review.rating,
            reviewText: review.reviewText,
            reviewDate: new Date(review.reviewDate),
            verified: review.verified,
            helpfulCount: review.helpfulCount || 0,
            reviewUrl: mapsUrl,
            language: "en"
          })
          savedCount++
        }
      } catch (error) {
        console.error("Error saving review:", error)
      }
    }

    return {
      success: true,
      reviewsCount: savedCount,
      error: savedCount === 0 ? "All reviews already exist in database" : undefined
    }
  } catch (error) {
    console.error("Error scraping Google Maps reviews:", error)
    if (browser) {
      await browser.close()
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape reviews"
    }
  }
}

export async function triggerReviewScraping(shopId: string, mapsUrl: string) {
  try {
    const result = await scrapeGoogleMapsReviews(shopId, mapsUrl)
    return result
  } catch (error) {
    console.error("Error triggering review scraping:", error)
    return {
      success: false,
      error: "Failed to trigger review scraping"
    }
  }
}
