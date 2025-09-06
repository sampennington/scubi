"use server"

import { enqueueJob, getJobStatus } from "./queue"
import type { ScrapeReviewsJobInput } from "./types"

export async function enqueueReviewScraping(shopId: string, input: ScrapeReviewsJobInput) {
  return enqueueJob("scrape_reviews", shopId, input)
}

export async function getJobStatusAction(jobId: string) {
  return getJobStatus(jobId)
}
