"use server"

import { api } from "@/lib/api"
import { revalidatePath } from "next/cache"
import type { InstagramPost } from "../api/instagram"

type GetInstagramPostsParams = {
  shopId: string
  sortBy?: "date" | "likes" | "comments"
  sortOrder?: "asc" | "desc"
  postType?: "all" | "image" | "video" | "carousel"
  limit?: number
  offset?: number
}

type APIResponse<T> = Promise<{
  success: boolean
  data?: T
  error?: string
}>

export async function getInstagramPosts({
  shopId,
  sortBy = "date",
  sortOrder = "desc",
  postType = "all",
  limit = 20,
  offset = 0
}: GetInstagramPostsParams): APIResponse<InstagramPost[]> {
  try {
    const posts = await api.instagram.getInstagramPosts({
      shopId,
      sortBy,
      sortOrder,
      postType,
      limit,
      offset
    })

    return { success: true, data: posts }
  } catch (error) {
    console.error("Failed to fetch Instagram posts:", error)
    return { success: false, error: "Failed to fetch Instagram posts" }
  }
}

export async function deleteInstagramPost(id: string, revalidatePaths: string[] = []) {
  try {
    const result = await api.instagram.deleteInstagramPost(id)

    if (!result.success) {
      return { success: false, error: result.error }
    }

    revalidatePaths.forEach((path) => revalidatePath(path))

    return { success: true }
  } catch (error) {
    console.error("Failed to delete Instagram post:", error)
    return { success: false, error: "Failed to delete Instagram post" }
  }
}