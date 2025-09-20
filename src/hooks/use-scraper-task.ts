import { useState, useEffect, useRef } from "react"
import type { ScrapedSiteData } from "@/app/api/scrape-domain/route"
import type { TaskProgress } from "@/lib/queue/types"

interface TaskUpdate {
  type: "status" | "progress" | "result" | "error" | "connected" | "heartbeat"
  taskId: string
  timestamp: string
  status?: "waiting" | "active" | "completed" | "failed"
  progress?: TaskProgress
  message?: string
  result?: {
    success: boolean
    data?: ScrapedSiteData
    error?: string
    domain: string
  }
  error?: string
}

interface UseScraperTaskResult {
  isConnected: boolean
  isLoading: boolean
  progress: TaskProgress | null
  result: ScrapedSiteData | null
  partialResult: Partial<ScrapedSiteData> | null
  error: string | null
  status: string | null
}

export function useScraperTask(taskId: string | null): UseScraperTaskResult {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<TaskProgress | null>(null)
  const [result, setResult] = useState<ScrapedSiteData | null>(null)
  const [partialResult, setPartialResult] = useState<Partial<ScrapedSiteData> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!taskId) {
      return
    }

    // Reset state when taskId changes
    setIsConnected(false)
    setIsLoading(true)
    setProgress(null)
    setResult(null)
    setPartialResult(null)
    setError(null)
    setStatus(null)

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(`/api/tasks/scraper/${taskId}`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log("SSE connection opened for task:", taskId)
    }

    eventSource.onmessage = (event) => {
      try {
        const update: TaskUpdate = JSON.parse(event.data)
        console.log("SSE message received:", update)

        switch (update.type) {
          case "connected":
            setIsConnected(true)
            break

          case "status":
            setStatus(update.status || null)
            if (update.status === "active") {
              setIsLoading(true)
            }
            break

          case "progress":
            if (update.progress) {
              setProgress(update.progress)

              if (update.progress.partialResult) {
                setPartialResult(update.progress.partialResult as Partial<ScrapedSiteData>)
              }
            }
            break

          case "result":
            setIsLoading(false)
            setStatus(update.status || null)
            if (update.result?.success && update.result.data) {
              setResult(update.result.data)
            } else if (update.result?.error) {
              setError(update.result.error)
            }
            eventSource.close()
            break

          case "error":
            setIsLoading(false)
            setError(update.error || "Task failed")
            setStatus("failed")
            eventSource.close()
            break

          case "heartbeat":
            break
        }
      } catch (err) {
        console.error("Error parsing SSE message:", err)
      }
    }

    eventSource.onerror = (event) => {
      console.error("SSE error for task:", taskId, event)
      setIsConnected(false)
      setIsLoading(false)
      setError("Connection error. Please try again.")
    }

    return () => {
      eventSource.close()
    }
  }, [taskId])

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return {
    isConnected,
    isLoading,
    progress,
    result,
    partialResult,
    error,
    status
  }
}
