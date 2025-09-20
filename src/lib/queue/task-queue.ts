import { Queue, Worker, QueueEvents, type Job } from "bullmq"
import { EventEmitter } from "node:events"
import { redisConnection } from "./connection"
import type { TaskJobData, TaskDefinition, TaskUpdate, TaskProgress } from "./types"

export class TaskQueue extends EventEmitter {
  private queues = new Map<string, Queue>()
  private workers = new Map<string, Worker>()
  private queueEvents = new Map<string, QueueEvents>()

  registerTask<TData extends TaskJobData, TResult>(
    taskType: string,
    definition: TaskDefinition<TData, TResult>
  ): void {
    const { queueName, processor } = definition

    const queue = new Queue(queueName, {
      connection: redisConnection,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 2,
        delay: 1000,
        backoff: {
          type: "exponential",
          delay: 2000
        }
      }
    })

    const worker = new Worker(
      queueName,
      async (job: Job<TData>) => {
        console.log(`[Worker] Processing job ${job.id} of type ${taskType}`)
        const updateProgress = async (progress: TaskProgress) => {
          await job.updateProgress(progress)
        }

        try {
          const result = await processor({
            id: job.id!,
            data: job.data,
            updateProgress
          })
          console.log(`[Worker] Job ${job.id} completed successfully`)
          return result
        } catch (error) {
          console.error(`[Worker] Job ${job.id} failed:`, error)
          throw new Error(error instanceof Error ? error.message : "Task processing failed")
        }
      },
      {
        connection: redisConnection,
        concurrency: 1
      }
    )

    const events = new QueueEvents(queueName, { connection: redisConnection })

    this.setupWorkerEventListeners(worker, taskType)
    this.setupQueueEventListeners(events, taskType)

    worker.on("ready", () => {
      console.log(`[Worker] ${taskType} worker is ready`)
    })

    worker.on("error", (error) => {
      console.error(`[Worker] ${taskType} worker error:`, error)
    })

    this.queues.set(taskType, queue)
    this.workers.set(taskType, worker)
    this.queueEvents.set(taskType, events)
  }

  async addJob<TData extends TaskJobData>(
    taskType: string,
    data: TData,
    options?: { priority?: number; delay?: number }
  ): Promise<string> {
    const queue = this.queues.get(taskType)
    if (!queue) {
      throw new Error(`Task type "${taskType}" not registered`)
    }

    const job = await queue.add(taskType, data, options)
    return job.id!
  }

  async removeJob(taskType: string, jobId: string): Promise<boolean> {
    const job = await this.getJob(taskType, jobId)
    if (!job) return false

    await job.remove()
    return true
  }

  async getJobStatus(taskType: string, jobId: string): Promise<string | null> {
    const job = await this.getJob(taskType, jobId)
    if (!job) return null

    const state = await job.getState()
    return state
  }

  private async getJob(taskType: string, jobId: string): Promise<Job | null> {
    const queue = this.queues.get(taskType)
    if (!queue) return null

    const job = await queue.getJob(jobId)
    return job || null
  }

  private setupWorkerEventListeners(worker: Worker, taskType: string): void {
    worker.on("active", (job) => {
      this.emitTaskUpdate(taskType, job.id!, {
        type: "status",
        status: "active",
        message: "Task started"
      })
    })

    worker.on("progress", (job, progress) => {
      this.emitTaskUpdate(taskType, job.id!, {
        type: "progress",
        progress: progress as TaskProgress,
        message: (progress as TaskProgress).message || "Processing..."
      })
    })

    worker.on("completed", (job, result) => {
      this.emitTaskUpdate(taskType, job.id!, {
        type: "result",
        status: "completed",
        result,
        message: "Task completed successfully"
      })
    })

    worker.on("failed", (job, error) => {
      this.emitTaskUpdate(taskType, job?.id || "unknown", {
        type: "error",
        status: "failed",
        error: error.message,
        message: "Task failed"
      })
    })
  }

  private setupQueueEventListeners(events: QueueEvents, taskType: string): void {
    events.on("waiting", ({ jobId }) => {
      this.emitTaskUpdate(taskType, jobId, {
        type: "status",
        status: "waiting",
        message: "Task queued"
      })
    })
  }

  private emitTaskUpdate(
    taskType: string,
    jobId: string,
    update: Omit<TaskUpdate, "taskId" | "timestamp">
  ): void {
    const fullUpdate: TaskUpdate = {
      ...update,
      taskId: jobId,
      timestamp: new Date().toISOString()
    }

    this.emit("taskUpdate", taskType, jobId, fullUpdate)
    this.emit(`task:${jobId}`, fullUpdate)
  }

  async close(): Promise<void> {
    await Promise.all([
      ...Array.from(this.workers.values()).map((worker) => worker.close()),
      ...Array.from(this.queueEvents.values()).map((events) => events.close())
    ])
  }
}
