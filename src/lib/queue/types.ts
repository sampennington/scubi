export interface TaskJobData {
  shopId?: string
  [key: string]: unknown
}

export interface TaskProgress {
  percentage: number
  current: number
  total: number
  message: string
  partialResult?: unknown
}

export type TaskType = string

export interface TaskDefinition<TData = TaskJobData, TResult = unknown> {
  queueName: string
  processor: (job: {
    id: string
    data: TData
    updateProgress: (progress: TaskProgress) => Promise<void>
  }) => Promise<TResult>
}

export interface TaskUpdate {
  type: "status" | "progress" | "result" | "error" | "connected"
  taskId: string
  timestamp: string
  status?: "waiting" | "active" | "completed" | "failed"
  progress?: TaskProgress
  message?: string
  result?: unknown
  error?: string
}
