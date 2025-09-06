import type { JobType, ScrapeReviewsJobInput } from "../types"
import { processScrapeReviewsJob } from "./scrape-reviews"

type JobProcessor = (jobId: string, input: unknown) => Promise<void>

const processors: Record<JobType, JobProcessor> = {
  scrape_reviews: (jobId: string, input: unknown) =>
    processScrapeReviewsJob(jobId, input as ScrapeReviewsJobInput)
}

export function getJobProcessor(type: JobType): JobProcessor {
  const processor = processors[type]
  if (!processor) {
    throw new Error(`No processor found for job type: ${type}`)
  }
  return processor
}
