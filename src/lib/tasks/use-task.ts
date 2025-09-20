"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { TaskUpdate, TaskProgress } from "@/lib/queue/types"

type TaskStatus = "idle" | "waiting" | "active" | "completed" | "failed"

export interface UseTaskOptions<T> {
  onComplete?: (result: T) => void
  onError?: (error: string) => void
  onUpdate?: (update: TaskUpdate) => void
  autoConnect?: boolean
}

export interface UseTaskReturn<T> {
  // Task state
  taskId: string | null
  status: TaskStatus
  progress: TaskProgress | null
  message: string
  error: string | null
  result: T | null

  // Connection state
  isConnected: boolean

  // Actions
  startTask: (taskType: string, input: unknown) => Promise<void>
  abortTask: () => Promise<void>
  connectToTask: (taskId: string, taskType: string) => void
  disconnect: () => void
}

export function useTask<T>(options: UseTaskOptions<T> = {}): UseTaskReturn<T> {
  const { onComplete, onError, onUpdate, autoConnect = true } = options

  // Task state
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskType, setTaskType] = useState<string | null>(null)
  const [status, setStatus] = useState<TaskStatus>("idle")
  const [progress, setProgress] = useState<TaskProgress | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<T | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // SSE connection
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    setIsConnected(false)
  }, [])

  const connectToTask = useCallback(
    (newTaskId: string, newTaskType: string) => {
      // Clean up existing connection
      disconnect()

      setTaskId(newTaskId)
      setTaskType(newTaskType)
      setStatus("waiting")
      setProgress(null)
      setMessage("")
      setError(null)
      setResult(null)

      if (!autoConnect) return

      // Create SSE connection
      const eventSource = new EventSource(`/api/tasks/${newTaskType}?taskId=${newTaskId}`)

      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
      }

      eventSource.onmessage = (event) => {
        try {
          const update: TaskUpdate = JSON.parse(event.data)

          if (update.type === "connected") return

          if (update.status) setStatus(update.status)
          if (update.progress) setProgress(update.progress)
          if (update.message) setMessage(update.message)
          if (update.error) setError(update.error)
          if (update.result) setResult(update.result as T)

          onUpdate?.(update)

          if (update.status === "completed" && update.result) {
            onComplete?.(update.result as T)
          } else if (update.status === "failed") {
            onError?.(update.error || "Task failed")
          }
        } catch (err) {
          console.error("Error parsing SSE message:", err)
        }
      }

      eventSource.onerror = () => {
        setIsConnected(false)

        // Don't reconnect if task is completed/failed
        if (status === "completed" || status === "failed") {
          disconnect()
          return
        }

        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = setTimeout(() => {
          if (taskId && taskType) {
            connectToTask(taskId, taskType)
          }
        }, 3000)
      }
    },
    [autoConnect, disconnect, onComplete, onError, onUpdate, status, taskId, taskType]
  )

  const startTask = useCallback(
    async (newTaskType: string, input: unknown) => {
      try {
        setError(null)

        const response = await fetch(`/api/tasks/${newTaskType}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start", ...(input as Record<string, unknown>) })
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to start task")
        }

        // Connect to the new task
        connectToTask(data.taskId, newTaskType)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)
        onError?.(errorMessage)
      }
    },
    [connectToTask, onError]
  )

  const abortTask = useCallback(async () => {
    if (!taskId || !taskType) return

    try {
      const response = await fetch(`/api/tasks/${taskType}?taskId=${taskId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to abort task")
      }

      disconnect()
    } catch (err) {
      console.error("Error aborting task:", err)
    }
  }, [taskId, taskType, disconnect])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    // State
    taskId,
    status,
    progress,
    message,
    error,
    result,
    isConnected,

    // Actions
    startTask,
    abortTask,
    connectToTask,
    disconnect
  }
}
