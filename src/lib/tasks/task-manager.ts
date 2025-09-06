import { spawn, type ChildProcess } from "node:child_process"
import { EventEmitter } from "node:events"
import { nanoid } from "nanoid"
import type { TaskConfig, TaskUpdate, TaskStatus } from "./types"

interface RunningTask {
  taskId: string
  taskType: string
  process: ChildProcess
  status: TaskStatus
  startedAt: string
  emitter: EventEmitter
}

export class TaskManager extends EventEmitter {
  private runningTasks = new Map<string, RunningTask>()
  private taskQueue: TaskConfig[] = []
  private maxConcurrentTasks = 3

  async startTask<TInput>(taskType: string, input: TInput, shopId?: string): Promise<string> {
    const taskId = nanoid()
    const config: TaskConfig<TInput> = {
      taskId,
      taskType,
      input,
      shopId
    }

    // If we're at capacity, queue the task
    if (this.runningTasks.size >= this.maxConcurrentTasks) {
      this.taskQueue.push(config)
      this.emitUpdate(taskId, {
        type: "status",
        timestamp: new Date().toISOString(),
        taskId,
        status: "idle",
        message: "Task queued, waiting for available slot..."
      })
      return taskId
    }

    await this.executeTask(config)
    return taskId
  }

  private async executeTask<TInput>(config: TaskConfig<TInput>) {
    const { taskId, taskType, input, shopId } = config

    try {
      // Spawn child process for the specific task type
      const scriptPath = this.getTaskScript(taskType)
      const childProcess = spawn("node", [scriptPath], {
        stdio: ["pipe", "pipe", "pipe", "ipc"],
        env: { ...process.env }
      })

      const task: RunningTask = {
        taskId,
        taskType,
        process: childProcess,
        status: "running",
        startedAt: new Date().toISOString(),
        emitter: new EventEmitter()
      }

      this.runningTasks.set(taskId, task)

      // Send initial config to child process
      childProcess.send({ type: "init", config: { taskId, taskType, input, shopId } })

      // Listen for messages from child process
      childProcess.on("message", (message: any) => {
        const update: TaskUpdate = {
          ...message,
          timestamp: new Date().toISOString(),
          taskId
        }

        // Update task status
        if (update.status) {
          task.status = update.status
        }

        this.emitUpdate(taskId, update)

        // Clean up completed/failed tasks
        if (
          update.status === "completed" ||
          update.status === "failed" ||
          update.status === "aborted"
        ) {
          this.cleanupTask(taskId)
          this.processQueue()
        }
      })

      // Handle process errors
      childProcess.on("error", (error) => {
        this.emitUpdate(taskId, {
          type: "error",
          timestamp: new Date().toISOString(),
          taskId,
          status: "failed",
          error: error.message
        })
        this.cleanupTask(taskId)
        this.processQueue()
      })

      // Handle process exit
      childProcess.on("exit", (code) => {
        if (code !== 0 && task.status !== "completed" && task.status !== "aborted") {
          this.emitUpdate(taskId, {
            type: "error",
            timestamp: new Date().toISOString(),
            taskId,
            status: "failed",
            error: `Process exited with code ${code}`
          })
        }
        this.cleanupTask(taskId)
        this.processQueue()
      })

      // Initial status update
      this.emitUpdate(taskId, {
        type: "status",
        timestamp: new Date().toISOString(),
        taskId,
        status: "running",
        message: `Started ${taskType} task`
      })
    } catch (error) {
      this.emitUpdate(taskId, {
        type: "error",
        timestamp: new Date().toISOString(),
        taskId,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error"
      })
    }
  }

  pauseTask(taskId: string): boolean {
    const task = this.runningTasks.get(taskId)
    if (!task || task.status !== "running") return false

    task.process.send({ type: "pause" })
    task.status = "paused"

    this.emitUpdate(taskId, {
      type: "status",
      timestamp: new Date().toISOString(),
      taskId,
      status: "paused",
      message: "Task paused"
    })

    return true
  }

  resumeTask(taskId: string): boolean {
    const task = this.runningTasks.get(taskId)
    if (!task || task.status !== "paused") return false

    task.process.send({ type: "resume" })
    task.status = "running"

    this.emitUpdate(taskId, {
      type: "status",
      timestamp: new Date().toISOString(),
      taskId,
      status: "running",
      message: "Task resumed"
    })

    return true
  }

  abortTask(taskId: string): boolean {
    const task = this.runningTasks.get(taskId)
    if (!task) return false

    task.process.send({ type: "abort" })
    task.process.kill("SIGTERM")
    task.status = "aborted"

    this.emitUpdate(taskId, {
      type: "status",
      timestamp: new Date().toISOString(),
      taskId,
      status: "aborted",
      message: "Task aborted"
    })

    this.cleanupTask(taskId)
    this.processQueue()
    return true
  }

  getTaskStatus(taskId: string): TaskStatus | null {
    const task = this.runningTasks.get(taskId)
    return task?.status || null
  }

  private cleanupTask(taskId: string) {
    const task = this.runningTasks.get(taskId)
    if (task) {
      task.process.removeAllListeners()
      if (!task.process.killed) {
        task.process.kill()
      }
      this.runningTasks.delete(taskId)
    }
  }

  private async processQueue() {
    if (this.taskQueue.length === 0) return
    if (this.runningTasks.size >= this.maxConcurrentTasks) return

    const nextTask = this.taskQueue.shift()
    if (nextTask) {
      await this.executeTask(nextTask)
    }
  }

  private emitUpdate(taskId: string, update: TaskUpdate) {
    this.emit("taskUpdate", taskId, update)
    this.emit(`task:${taskId}`, update)
  }

  private getTaskScript(taskType: string): string {
    // Map task types to their script files
    const scripts: Record<string, string> = {
      "scrape-reviews": require.resolve("./workers/scrape-reviews-worker.js"),
      "export-data": require.resolve("./workers/export-data-worker.js"),
      "generate-report": require.resolve("./workers/generate-report-worker.js")
    }

    const script = scripts[taskType]
    if (!script) {
      throw new Error(`Unknown task type: ${taskType}`)
    }

    return script
  }
}

// Singleton instance
export const taskManager = new TaskManager()
