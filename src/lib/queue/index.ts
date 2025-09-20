import { TaskQueue } from "./task-queue"
import type { TaskJobData, TaskUpdate } from "./types"

class QueueManager {
  private taskQueue: TaskQueue

  constructor() {
    this.taskQueue = new TaskQueue()
    this.registerTasks()
  }

  private registerTasks(): void {
    // Future tasks will be registered here
  }

  async addJob<TData extends TaskJobData>(
    taskType: string,
    data: TData,
    options?: { priority?: number; delay?: number }
  ): Promise<string> {
    return this.taskQueue.addJob(taskType, data, options)
  }

  async removeJob(taskType: string, jobId: string): Promise<boolean> {
    return this.taskQueue.removeJob(taskType, jobId)
  }

  async getJobStatus(taskType: string, jobId: string): Promise<string | null> {
    return this.taskQueue.getJobStatus(taskType, jobId)
  }

  onTaskUpdate(callback: (taskType: string, jobId: string, update: TaskUpdate) => void): void {
    this.taskQueue.on("taskUpdate", callback)
  }

  onSpecificTask(jobId: string, callback: (update: TaskUpdate) => void): void {
    this.taskQueue.on(`task:${jobId}`, callback)
  }

  offSpecificTask(jobId: string, callback: (update: TaskUpdate) => void): void {
    this.taskQueue.off(`task:${jobId}`, callback)
  }

  async close(): Promise<void> {
    await this.taskQueue.close()
  }
}

export const queueManager = new QueueManager()
export * from "./types"
