export type JobStatus = "pending" | "running" | "completed" | "failed"

export type JobType = "scrape_reviews"

export interface BaseJob {
  id: string
  type: JobType
  status: JobStatus
  shopId: string
  progress: number
  error?: string
  createdAt: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
}

export interface ScrapeReviewsJobInput {
  mapsUrl: string
  blockId?: string
}

export interface ScrapeReviewsJobOutput {
  reviewsScraped: number
  reviewsSaved: number
  duplicatesSkipped: number
}

export interface Job<TInput = unknown, TOutput = unknown> extends BaseJob {
  input: TInput
  output?: TOutput
}

export type ScrapeReviewsJob = Job<ScrapeReviewsJobInput, ScrapeReviewsJobOutput>
