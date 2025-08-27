"use server"

import { api } from "@/lib/api"
import { revalidatePath } from "next/cache"
import type { Review } from "../api/reviews"

type GetReviewsParams = {
  shopId: string
  platform?: string
  sortBy?: "date" | "rating" | "helpful"
  sortOrder?: "asc" | "desc"
  filterRating?: "all" | "5" | "4" | "3" | "2" | "1"
  limit?: number
  offset?: number
}

type APIResponse<T> = Promise<{
  success: boolean
  data?: T
  error?: string
}>

export async function getReviews({
  shopId,
  platform,
  sortBy = "date",
  sortOrder = "desc",
  filterRating = "all",
  limit = 10,
  offset = 0
}: GetReviewsParams): APIResponse<Review[]> {
  try {
    const reviews = await api.reviews.getReviews({
      shopId,
      platform,
      sortBy,
      sortOrder,
      filterRating,
      limit,
      offset
    })

    return { success: true, data: reviews }
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return { success: false, error: "Failed to fetch reviews" }
  }
}

export async function getReviewsAggregate(
  shopId: string,
  platform?: string
): APIResponse<{ avgRating: number; totalReviews: number }> {
  try {
    const aggregate = await api.reviews.getReviewsAggregate(shopId, platform)
    return { success: true, data: aggregate }
  } catch (error) {
    console.error("Failed to fetch reviews aggregate:", error)
    return { success: false, error: "Failed to fetch reviews aggregate" }
  }
}

export async function deleteReview(id: string, revalidatePaths: string[] = []) {
  try {
    const result = await api.reviews.deleteReview(id)

    if (!result.success) {
      return { success: false, error: result.error }
    }

    revalidatePaths.forEach((path) => revalidatePath(path))

    return { success: true }
  } catch (error) {
    console.error("Failed to delete review:", error)
    return { success: false, error: "Failed to delete review" }
  }
}
