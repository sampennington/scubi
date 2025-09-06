import { type NextRequest, NextResponse } from "next/server"
import { taskManager } from "@/lib/tasks/task-manager"
import type { TaskUpdate } from "@/lib/tasks/types"

interface TaskRouteParams {
  params: {
    taskType: string
  }
}

// GET: Stream real-time updates via SSE
export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get("taskId")

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 })
  }

  // Create SSE stream
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: "connected",
        taskId,
        timestamp: new Date().toISOString()
      })}\n\n`
      controller.enqueue(encoder.encode(initialMessage))

      // Listen for task updates
      const handleUpdate = (update: TaskUpdate) => {
        const message = `data: ${JSON.stringify(update)}\n\n`
        try {
          controller.enqueue(encoder.encode(message))

          // Close stream when task completes
          if (
            update.status === "completed" ||
            update.status === "failed" ||
            update.status === "aborted"
          ) {
            setTimeout(() => {
              try {
                controller.close()
              } catch (e) {
                // Stream might already be closed
              }
            }, 1000)
          }
        } catch (error) {
          // Client disconnected, clean up
          taskManager.off(`task:${taskId}`, handleUpdate)
          try {
            controller.close()
          } catch (e) {
            // Already closed
          }
        }
      }

      // Register listener for this specific task
      taskManager.on(`task:${taskId}`, handleUpdate)

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        taskManager.off(`task:${taskId}`, handleUpdate)
        try {
          controller.close()
        } catch (e) {
          // Already closed
        }
      })
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  })
}

// POST: Start or resume task
export async function POST(request: NextRequest, { params }: TaskRouteParams) {
  try {
    const { taskType } = params
    const body = await request.json()
    const { action = "start", taskId, ...input } = body

    if (action === "start") {
      // Start new task
      const newTaskId = await taskManager.startTask(taskType, input, input.shopId)
      return NextResponse.json({
        success: true,
        taskId: newTaskId,
        message: `${taskType} task started`
      })
    }

    if (action === "resume" && taskId) {
      const success = taskManager.resumeTask(taskId)
      return NextResponse.json({
        success,
        taskId,
        message: success ? "Task resumed" : "Failed to resume task"
      })
    }

    if (action === "pause" && taskId) {
      const success = taskManager.pauseTask(taskId)
      return NextResponse.json({
        success,
        taskId,
        message: success ? "Task paused" : "Failed to pause task"
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// DELETE: Abort task
export async function DELETE(request: NextRequest, { params }: TaskRouteParams) {
  try {
    const { taskType } = params
    const taskId = request.nextUrl.searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 })
    }

    const success = taskManager.abortTask(taskId)
    return NextResponse.json({
      success,
      taskId,
      taskType,
      message: success ? "Task aborted" : "Failed to abort task"
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
