#!/usr/bin/env node

import { chromium, type Browser, type Page } from 'playwright'
import { db } from '@/database/db'
import { reviews } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getReviewExtractionScript, type ReviewSelectors, type ScrapedReview } from '@/lib/scraping/review-extractors'
import type { ScrapeReviewsInput, ScrapeReviewsOutput, TaskUpdate } from '../types'

// Google Maps CSS selectors
const SELECTORS: ReviewSelectors = {
  reviewContainers: '[data-review-id], .jftiEf, [jsaction*="review"]',
  reviewerName: '.d4r55, .TSUbDb',
  reviewerPhoto: 'img[src*="googleusercontent"], .NBa7we img',
  starsContainer: '.kvMYJc, .DU9Pgb',
  filledStars: '[style*="color: rgb(251, 188, 4)"], .gold, .lTi8oc.z3HNkc',
  reviewText: '.MyEned, .wiI7pd',
  reviewTextExpandable: '[data-expandable-section]',
  reviewDate: '.rsqaWe, .p34Wcf',
  localGuide: '[data-value*="Local Guide"]'
}

class ScrapeReviewsWorker {
  private taskId!: string
  private isPaused = false
  private isAborted = false
  private browser?: Browser
  private page?: Page

  async init(config: { taskId: string, input: ScrapeReviewsInput }) {
    this.taskId = config.taskId
    
    try {
      await this.execute(config.input)
    } catch (error) {
      this.sendUpdate({
        type: 'error',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private async execute(input: ScrapeReviewsInput) {
    const { mapsUrl, shopId } = input

    if (this.isAborted) return

    this.sendUpdate({
      type: 'status',
      status: 'running',
      message: 'Launching browser...',
      progress: { percentage: 10, current: 1, total: 10, message: 'Starting up' }
    })

    // Launch browser
    this.browser = await chromium.launch({ headless: true })
    this.page = await this.browser.newPage({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      locale: 'en-US'
    })

    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    })

    await this.checkPauseOrAbort()

    // Navigate to page
    const englishUrl = mapsUrl.includes('?') 
      ? `${mapsUrl}&hl=en&gl=us` 
      : `${mapsUrl}?hl=en&gl=us`

    this.sendUpdate({
      type: 'progress',
      message: 'Navigating to Google Maps...',
      progress: { percentage: 25, current: 2, total: 10, message: 'Loading page' }
    })

    await this.page.goto(englishUrl)
    await this.page.waitForTimeout(3000)

    await this.checkPauseOrAbort()

    // Click reviews button
    this.sendUpdate({
      type: 'progress',
      message: 'Finding reviews section...',
      progress: { percentage: 40, current: 4, total: 10, message: 'Locating reviews' }
    })

    try {
      await this.page.click('[aria-label^="Reviews" i]')
      await this.page.waitForTimeout(2000)
    } catch (error) {
      throw new Error('Could not find reviews section. Make sure this is a valid business page.')
    }

    await this.checkPauseOrAbort()

    // Scroll to load more reviews
    this.sendUpdate({
      type: 'progress',
      message: 'Loading reviews...',
      progress: { percentage: 60, current: 6, total: 10, message: 'Scrolling to load reviews' }
    })

    await this.page.evaluate(async () => {
      const scrollContainer = document.querySelector('[role="main"]') || document.body
      for (let i = 0; i < 5; i++) {
        scrollContainer.scrollBy(0, 1000)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    })

    await this.checkPauseOrAbort()

    // Extract reviews
    this.sendUpdate({
      type: 'progress',
      message: 'Extracting review data...',
      progress: { percentage: 80, current: 8, total: 10, message: 'Parsing reviews' }
    })

    const scrapedReviews = await this.page.evaluate(
      new Function(`return ${getReviewExtractionScript(SELECTORS)}`)()
    ) as ScrapedReview[]

    await this.browser.close()

    if (scrapedReviews.length === 0) {
      throw new Error('No reviews found on this page')
    }

    await this.checkPauseOrAbort()

    // Save to database
    this.sendUpdate({
      type: 'progress',
      message: 'Saving reviews to database...',
      progress: { percentage: 90, current: 9, total: 10, message: 'Saving to database' }
    })

    let savedCount = 0
    const savedReviews = []

    for (const review of scrapedReviews) {
      if (this.isAborted) return

      try {
        // Check for duplicates
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
          savedReviews.push({
            reviewerName: review.reviewerName,
            rating: review.rating,
            reviewText: review.reviewText,
            reviewDate: review.reviewDate,
            verified: review.verified
          })
        }
      } catch (error) {
        // Continue with other reviews if one fails
      }
    }

    // Complete successfully
    const result: ScrapeReviewsOutput = {
      reviewsScraped: scrapedReviews.length,
      reviewsSaved: savedCount,
      duplicatesSkipped: scrapedReviews.length - savedCount,
      reviews: savedReviews
    }

    this.sendUpdate({
      type: 'result',
      status: 'completed',
      message: `Successfully scraped ${savedCount} new reviews`,
      progress: { percentage: 100, current: 10, total: 10, message: 'Complete' },
      result
    })
  }

  private async checkPauseOrAbort() {
    if (this.isAborted) {
      if (this.browser) await this.browser.close()
      process.exit(0)
    }

    while (this.isPaused && !this.isAborted) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  private sendUpdate(update: Partial<TaskUpdate>) {
    if (process.send) {
      process.send({
        timestamp: new Date().toISOString(),
        taskId: this.taskId,
        ...update
      })
    }
  }

  pause() {
    this.isPaused = true
    this.sendUpdate({
      type: 'status',
      status: 'paused',
      message: 'Task paused'
    })
  }

  resume() {
    this.isPaused = false
    this.sendUpdate({
      type: 'status',
      status: 'running',
      message: 'Task resumed'
    })
  }

  async abort() {
    this.isAborted = true
    if (this.browser) {
      await this.browser.close()
    }
    this.sendUpdate({
      type: 'status',
      status: 'aborted',
      message: 'Task aborted'
    })
    process.exit(0)
  }
}

// Worker instance
const worker = new ScrapeReviewsWorker()

// Handle messages from parent process
process.on('message', async (message: any) => {
  switch (message.type) {
    case 'init':
      await worker.init(message.config)
      break
    case 'pause':
      worker.pause()
      break
    case 'resume':
      worker.resume()
      break
    case 'abort':
      await worker.abort()
      break
  }
})

// Handle process termination
process.on('SIGTERM', async () => {
  await worker.abort()
})