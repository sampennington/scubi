import { TaskQueue } from "./task-queue"
import { scraperTaskDefinition } from "./tasks/scraper"

export class TaskManager {
  private static instance: TaskManager
  private taskQueue: TaskQueue
  private initialized = false

  private constructor() {
    this.taskQueue = new TaskQueue()
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return

    console.log("[TaskManager] Initializing...")
    this.registerTasks()
    this.initialized = true
    console.log("[TaskManager] Initialized successfully")
  }

  static async getInstance(): Promise<TaskManager> {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager()
    }
    await TaskManager.instance.initialize()
    return TaskManager.instance
  }

  private registerTasks(): void {
    this.taskQueue.registerTask("website-scraper", scraperTaskDefinition)
  }

  getTaskQueue(): TaskQueue {
    return this.taskQueue
  }

  async addScraperTask(domain: string, shopId?: string): Promise<string> {
    return this.taskQueue.addJob("website-scraper", { domain, shopId })
  }

  async getTaskStatus(taskType: string, jobId: string): Promise<string | null> {
    return this.taskQueue.getJobStatus(taskType, jobId)
  }

  async removeTask(taskType: string, jobId: string): Promise<boolean> {
    return this.taskQueue.removeJob(taskType, jobId)
  }

  async close(): Promise<void> {
    await this.taskQueue.close()
  }
}

// Export a promise that resolves to the initialized task manager
export const getTaskManager = () => TaskManager.getInstance()