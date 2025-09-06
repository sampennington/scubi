import { NextRequest, NextResponse } from "next/server"
import { chromium, type Browser, type Page } from "playwright"
import { db } from "@/database/db"
import { reviews } from "@/database/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { updateJobStatus } from "@/lib/jobs/api"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import {
  getReviewExtractionScript,
  type ReviewSelectors,
  type ScrapedReview
} from "@/lib/scraping/review-extractors"

// Google Maps CSS selectors
const SELECTORS: ReviewSelectors = {
  reviewContainers: '[data-review-id], .jftiEf, [jsaction*="review"]',
  reviewerName: ".d4r55, .TSUbDb",
  reviewerPhoto: 'img[src*="googleusercontent"], .NBa7we img',
  starsContainer: ".kvMYJc, .DU9Pgb",
  filledStars: '[style*="color: rgb(251, 188, 4)"], .gold, .lTi8oc.z3HNkc',
  reviewText: ".MyEned, .wiI7pd",
  reviewTextExpandable: "[data-expandable-section]",
  reviewDate: ".rsqaWe, .p34Wcf",
  localGuide: '[data-value*="Local Guide"]'
}

async function captureFailureScreenshot(page: Page, jobId: string, _error: string) {
  try {
    const screenshotDir = join(process.cwd(), "debug-screenshots")
    await mkdir(screenshotDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `scrape-failure-${jobId}-${timestamp}.png`
    const screenshotPath = join(screenshotDir, filename)

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    })

    // Also save page HTML for debugging
    const htmlContent = await page.content()
    const htmlPath = join(screenshotDir, `scrape-failure-${jobId}-${timestamp}.html`)
    await writeFile(htmlPath, htmlContent)

    // Screenshots saved silently for debugging

    return { screenshotPath, htmlPath }
  } catch (screenshotError) {
    console.error("Failed to capture debug screenshot:", screenshotError)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { jobId, shopId, mapsUrl } = await request.json()

    if (!jobId || !shopId || !mapsUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      )
    }

    await updateJobStatus(jobId, "running", { progress: 10 })

    let browser: Browser | undefined
    let page: Page | undefined
    try {
      browser = await chromium.launch({ headless: true })

      page = await browser.newPage({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        locale: "en-US"
      })

      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9"
      })

      await updateJobStatus(jobId, "running", { progress: 25 })

      const englishUrl = mapsUrl.includes("?") ? `${mapsUrl}&hl=en&gl=us` : `${mapsUrl}?hl=en&gl=us`

      await page.goto(englishUrl)
      await page.waitForTimeout(3000)

      await page.click('[aria-label^="Reviews" i]')
      await page.waitForTimeout(2000)

      await updateJobStatus(jobId, "running", { progress: 50 })

      await page.evaluate(async () => {
        const scrollContainer = document.querySelector('[role="main"]') || document.body
        for (let i = 0; i < 5; i++) {
          scrollContainer.scrollBy(0, 1000)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      })

      await updateJobStatus(jobId, "running", { progress: 75 })

      const scrapedReviews: ScrapedReview[] = await page.evaluate(
        new Function(`return ${getReviewExtractionScript(SELECTORS)}`)()
      )

      await browser.close()

      if (scrapedReviews.length === 0) {
        // Capture screenshot when no reviews are found to help debug
        await captureFailureScreenshot(page, jobId, "No reviews found on this page")

        await updateJobStatus(jobId, "failed", {
          error: "No reviews found on this page"
        })
        return NextResponse.json({ success: false, error: "No reviews found" })
      }

      await updateJobStatus(jobId, "running", { progress: 90 })

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

      await updateJobStatus(jobId, "completed", {
        progress: 100,
        output: {
          reviewsScraped: scrapedReviews.length,
          reviewsSaved: savedCount,
          duplicatesSkipped: scrapedReviews.length - savedCount
        }
      })

      return NextResponse.json({
        success: true,
        reviewsCount: savedCount,
        totalFound: scrapedReviews.length
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Scraping failed"

      if (page) {
        await captureFailureScreenshot(page, jobId, errorMessage)
      }

      if (browser) {
        await browser.close()
      }

      await updateJobStatus(jobId, "failed", {
        error: errorMessage
      })

      return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
    }
  } catch (error) {
    // Keep this one for API-level errors
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "API request failed" }, { status: 500 })
  }
}
