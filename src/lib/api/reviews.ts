import { db } from "@/database/db"
import { reviews } from "@/database/schema"
import { eq, desc, asc, gte, and } from "drizzle-orm"

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
export type ReviewsAggregate = {
  totalReviews: number
  avgRating: number
}

export async function getReviews({
  shopId,
  platform,
  sortBy = "date",
  sortOrder = "desc",
  filterRating = "all",
  limit = 10,
  offset = 0
}: {
  shopId: string
  platform?: string
  sortBy?: "date" | "rating" | "helpful"
  sortOrder?: "asc" | "desc"
  filterRating?: "all" | "5" | "4" | "3" | "2" | "1"
  limit?: number
  offset?: number
}) {
  const conditions = [eq(reviews.shopId, shopId)]

  if (platform && platform !== "all") {
    conditions.push(eq(reviews.platform, platform))
  }

  if (filterRating !== "all") {
    const minRating = parseInt(filterRating)
    conditions.push(gte(reviews.rating, minRating))
  }

  const baseQuery = db.select().from(reviews).where(and(...conditions))

  if (sortBy === "rating") {
    return sortOrder === "desc"
      ? baseQuery.orderBy(desc(reviews.rating)).limit(limit).offset(offset)
      : baseQuery.orderBy(asc(reviews.rating)).limit(limit).offset(offset)
  } else if (sortBy === "helpful") {
    return sortOrder === "desc"
      ? baseQuery.orderBy(desc(reviews.helpfulCount)).limit(limit).offset(offset)
      : baseQuery.orderBy(asc(reviews.helpfulCount)).limit(limit).offset(offset)
  } else {
    return sortOrder === "desc"
      ? baseQuery.orderBy(desc(reviews.reviewDate)).limit(limit).offset(offset)
      : baseQuery.orderBy(asc(reviews.reviewDate)).limit(limit).offset(offset)
  }
}

export async function getReviewsAggregate(shopId: string, platform?: string): Promise<ReviewsAggregate> {
  const conditions = [eq(reviews.shopId, shopId)]

  if (platform && platform !== "all") {
    conditions.push(eq(reviews.platform, platform))
  }

  const countResult = await db
    .select({ count: reviews.id })
    .from(reviews)
    .where(and(...conditions))

  const ratingResult = await db
    .select({ avgRating: reviews.rating })
    .from(reviews)
    .where(and(...conditions))

  const totalReviews = countResult.length
  const avgRating = ratingResult.length > 0
    ? ratingResult.reduce((sum, row) => sum + (row.avgRating || 0), 0) / ratingResult.length
    : 0

  return { totalReviews, avgRating }
}

export async function deleteReview(id: string) {
  try {
    await db.delete(reviews).where(eq(reviews.id, id))
    return { success: true }
  } catch (error) {
    console.error("Failed to delete review:", error)
    return { success: false, error: "Failed to delete review" }
  }
}

export async function getReviewById(id: string) {
  try {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id))
    return { success: true, data: review }
  } catch (error) {
    console.error("Failed to fetch review:", error)
    return { success: false, error: "Failed to fetch review" }
  }
}

export const reviewsApi = {
  getReviews,
  getReviewsAggregate,
  deleteReview,
}
