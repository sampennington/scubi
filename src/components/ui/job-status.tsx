"use client"

import { useState, useEffect, useCallback } from "react"
import { Progress } from "./progress"
import { CheckCircle, XCircle, Loader2, Clock } from "lucide-react"
import { getJobStatus } from "@/lib/jobs/queue"
import type { Job } from "@/lib/jobs/types"

interface JobStatusProps {
  jobId: string
  onComplete?: (job: Job) => void
  onError?: (error: string) => void
}

export function JobStatus({ jobId, onComplete, onError }: JobStatusProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  const pollJobStatus = useCallback(async () => {
    try {
      const result = await getJobStatus(jobId)
      if (result.success && result.job) {
        setJob(result.job)

        if (result.job.status === "completed") {
          onComplete?.(result.job)
        } else if (result.job.status === "failed") {
          onError?.(result.job.error || "Job failed")
        }
      }
    } catch (error) {
      console.error("Error polling job status:", error)
    } finally {
      setLoading(false)
    }
  }, [jobId, onComplete, onError])

  useEffect(() => {
    pollJobStatus()

    // Poll every 2 seconds while job is running
    const interval = setInterval(() => {
      if (!job || (job.status !== "completed" && job.status !== "failed")) {
        pollJobStatus()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [pollJobStatus, job])

  if (loading && !job) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading job status...
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm">
        <XCircle className="h-4 w-4" />
        Job not found
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (job.status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (job.status) {
      case "pending":
        return "Waiting to start..."
      case "running":
        return "Processing..."
      case "completed":
        return "Completed successfully"
      case "failed":
        return `Failed: ${job.error}`
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="font-medium text-sm">{getStatusText()}</span>
      </div>

      {(job.status === "running" || job.status === "completed") && (
        <div className="space-y-2">
          <Progress value={job.progress} className="h-2" />
          <div className="text-muted-foreground text-xs">Progress: {job.progress}%</div>
        </div>
      )}

      {job.status === "completed" && job.output && job.type === "scrape_reviews" && (
        <div className="rounded-lg bg-green-50 p-3 text-green-800 text-sm">
          <div className="font-medium">Reviews scraped successfully!</div>
          <div className="mt-1 text-xs">
            • {(job.output as any).reviewsScraped} reviews found •{" "}
            {(job.output as any).reviewsSaved} new reviews saved •{" "}
            {(job.output as any).duplicatesSkipped} duplicates skipped
          </div>
        </div>
      )}
    </div>
  )
}
