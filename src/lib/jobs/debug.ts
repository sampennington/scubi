"use server"

import { db } from "@/database/db"
import { reviews, jobs } from "@/database/schema"
import { eq, desc } from "drizzle-orm"

export async function checkRecentReviews(shopId: string) {
  const recentReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.shopId, shopId))
    .orderBy(desc(reviews.createdAt))
    .limit(10)

  return recentReviews
}

export async function checkRecentJobs(shopId: string) {
  const recentJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.shopId, shopId))
    .orderBy(desc(jobs.createdAt))
    .limit(5)

  return recentJobs
}

export async function getJobLogs(jobId: string) {
  const job = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1)

  return job[0] || null
}
