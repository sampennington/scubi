"use server"

import { db } from "@/database/db"
import { jobs } from "@/database/schema"
import { eq, and, desc } from "drizzle-orm"
import { nanoid } from "nanoid"
import type { JobType, JobStatus, Job } from "./types"

export async function createJob<TInput>(
  type: JobType,
  shopId: string,
  input: TInput
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    const jobId = nanoid()

    await db.insert(jobs).values({
      id: jobId,
      type,
      status: "pending",
      shopId,
      input,
      progress: 0
    })

    return { success: true, jobId }
  } catch (error) {
    console.error("Failed to create job:", error)
    return { success: false, error: "Failed to create job" }
  }
}

export async function getJob(
  jobId: string
): Promise<{ success: boolean; job?: Job; error?: string }> {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId))

    if (!job) {
      return { success: false, error: "Job not found" }
    }

    return { success: true, job: job as Job }
  } catch (error) {
    console.error("Failed to get job:", error)
    return { success: false, error: "Failed to get job" }
  }
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  options?: {
    progress?: number
    output?: unknown
    error?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Partial<Job> = {
      status,
      updatedAt: new Date()
    }

    if (options?.progress !== undefined) {
      updateData.progress = options.progress
    }

    if (options?.output !== undefined) {
      updateData.output = options.output
    }

    if (options?.error !== undefined) {
      updateData.error = options.error
    }

    if (status === "running" && !updateData.startedAt) {
      updateData.startedAt = new Date()
    }

    if (status === "completed" || status === "failed") {
      updateData.completedAt = new Date()
    }

    await db.update(jobs).set(updateData).where(eq(jobs.id, jobId))

    return { success: true }
  } catch (error) {
    console.error("Failed to update job status:", error)
    return { success: false, error: "Failed to update job status" }
  }
}

export async function getJobsByShop(
  shopId: string,
  type?: JobType,
  status?: JobStatus
): Promise<{ success: boolean; jobs?: Job[]; error?: string }> {
  try {
    const conditions = [eq(jobs.shopId, shopId)]

    if (type) {
      conditions.push(eq(jobs.type, type))
    }

    if (status) {
      conditions.push(eq(jobs.status, status))
    }

    const result = await db
      .select()
      .from(jobs)
      .where(and(...conditions))
      .orderBy(desc(jobs.createdAt))

    return { success: true, jobs: result as Job[] }
  } catch (error) {
    console.error("Failed to get jobs by shop:", error)
    return { success: false, error: "Failed to get jobs" }
  }
}
