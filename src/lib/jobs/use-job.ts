"use client"

import { useState, useCallback } from "react"
import type { Job } from "./types"

interface UseJobOptions<TInput = unknown, TOutput = unknown> {
  onComplete?: (job: Job<TInput, TOutput>) => void
  onError?: (error: string) => void
}

interface UseJobReturn<TInput = unknown, TOutput = unknown> {
  currentJobId: string | null
  showJobStatus: boolean
  startJob: (jobId: string) => void
  hideJobStatus: () => void
  handleJobComplete: (job: Job<TInput, TOutput>) => void
  handleJobError: (error: string) => void
}

export function useJob<TInput = unknown, TOutput = unknown>(
  options: UseJobOptions<TInput, TOutput> = {}
): UseJobReturn<TInput, TOutput> {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [showJobStatus, setShowJobStatus] = useState(false)

  const startJob = useCallback((jobId: string) => {
    setCurrentJobId(jobId)
    setShowJobStatus(true)
  }, [])

  const hideJobStatus = useCallback(() => {
    setCurrentJobId(null)
    setShowJobStatus(false)
  }, [])

  const handleJobComplete = useCallback(
    (job: Job<TInput, TOutput>) => {
      options.onComplete?.(job)
      hideJobStatus()
    },
    [options.onComplete, hideJobStatus]
  )

  const handleJobError = useCallback(
    (error: string) => {
      options.onError?.(error)
      hideJobStatus()
    },
    [options.onError, hideJobStatus]
  )

  return {
    currentJobId,
    showJobStatus,
    startJob,
    hideJobStatus,
    handleJobComplete,
    handleJobError
  }
}
