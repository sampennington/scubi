import { type NextRequest, NextResponse } from "next/server"
import { queueManager } from "@/lib/queue"
import type { TaskUpdate } from "@/lib/queue/types"

interface TaskRouteParams {
  params: Promise<{
    taskType: string
  }>
}

// GET: Stream real-time updates via SSE
export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get("taskId")

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 })
  }

  console.log(`[API] SSE connection established for task: ${taskId}`)

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const initialMessage = `data: ${JSON.stringify({
        type: "connected",
        taskId,
        timestamp: new Date().toISOString()
      })}\n\n`
      controller.enqueue(encoder.encode(initialMessage))

      const handleUpdate = (update: TaskUpdate) => {
        const message = `data: ${JSON.stringify(update)}\n\n`
        try {
          controller.enqueue(encoder.encode(message))

          if (update.status === "completed" || update.status === "failed") {
            setTimeout(() => {
              try {
                controller.close()
              } catch {}
            }, 1000)
          }
        } catch {
          queueManager.offSpecificTask(taskId, handleUpdate)
          try {
            controller.close()
          } catch {}
        }
      }

      queueManager.onSpecificTask(taskId, handleUpdate)

      request.signal.addEventListener("abort", () => {
        queueManager.offSpecificTask(taskId, handleUpdate)
        try {
          controller.close()
        } catch {}
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
    const { taskType } = await params
    const body = await request.json()
    const { action = "start", ...input } = body

    if (action === "start") {
      // Start new task
      console.log(`[API] Starting ${taskType} task with input:`, input)
      const newTaskId = await queueManager.addJob(taskType, input)
      console.log(`[API] Started ${taskType} task with ID: ${newTaskId}`)
      return NextResponse.json({
        success: true,
        taskId: newTaskId,
        message: `${taskType} task started`
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
    const { taskType } = await params
    const taskId = request.nextUrl.searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 })
    }

    const success = await queueManager.removeJob(taskType, taskId)
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
