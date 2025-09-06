// SSE Task System Types

export type TaskStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'aborted'

export interface TaskProgress {
  percentage: number
  current: number
  total: number
  message: string
}

export interface TaskUpdate {
  type: 'status' | 'progress' | 'message' | 'error' | 'result'
  timestamp: string
  taskId: string
  status?: TaskStatus
  progress?: TaskProgress
  message?: string
  error?: string
  result?: unknown
}

export interface TaskConfig<TInput = unknown> {
  taskId: string
  taskType: string
  input: TInput
  shopId?: string
}

export interface TaskResult<TOutput = unknown> {
  taskId: string
  status: TaskStatus
  result?: TOutput
  error?: string
  startedAt: string
  completedAt?: string
  duration?: number
}

// Specific task types
export interface ScrapeReviewsInput {
  mapsUrl: string
  shopId: string
}

export interface ScrapeReviewsOutput {
  reviewsScraped: number
  reviewsSaved: number
  duplicatesSkipped: number
  reviews: Array<{
    reviewerName: string
    rating: number
    reviewText: string
    reviewDate: string
    verified: boolean
  }>
}