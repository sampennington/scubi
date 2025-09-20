import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getTaskManager } from "@/lib/queue/manager"
import { createResponse } from "better-sse"

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { taskId } = await params

    return createResponse(request, { keepAlive: 30000 }, async (session) => {
      session.push({
        type: "connected",
        taskId,
        timestamp: new Date().toISOString(),
        message: "Connected to task stream"
      })

      try {
        const taskManager = await getTaskManager()
        const taskQueue = taskManager.getTaskQueue()

        const initialStatus = await taskQueue.getJobStatus("website-scraper", taskId)
        console.log(`[SSE] Initial task status for ${taskId}:`, initialStatus)

        if (!initialStatus) {
          session.push({
            type: "error",
            taskId,
            timestamp: new Date().toISOString(),
            error: "Task not found",
            message: "Task does not exist"
          })
          return
        }

        taskQueue.on(`task:${taskId}`, session.push)

        session.on("disconnected", () => {
          taskQueue.off(`task:${taskId}`, session.push)
        })
      } catch (error) {
        console.error("Failed to initialize task manager:", error)
        session.push({
          type: "error",
          taskId,
          timestamp: new Date().toISOString(),
          error: "Failed to connect to task system",
          message: "Task system initialization failed"
        })
      }
    })
  } catch (error) {
    console.error("SSE endpoint error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
