import { db } from "@/database/db"
import { instagramPosts } from "@/database/schema"
import { eq, desc, asc, and } from "drizzle-orm"

export type InstagramPost = typeof instagramPosts.$inferSelect
export type NewInstagramPost = typeof instagramPosts.$inferInsert

export async function getInstagramPosts({
  shopId,
  postType = "all",
  sortBy = "date",
  sortOrder = "desc",
  limit = 20,
  offset = 0
}: {
  shopId: string
  postType?: "all" | "image" | "video" | "carousel"
  sortBy?: "date" | "likes" | "comments"
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}) {
  const conditions = [eq(instagramPosts.shopId, shopId)]

  if (postType !== "all") {
    conditions.push(eq(instagramPosts.postType, postType))
  }

  const baseQuery = db
    .select()
    .from(instagramPosts)
    .where(and(...conditions))

  if (sortBy === "likes") {
    return sortOrder === "desc"
      ? baseQuery.orderBy(desc(instagramPosts.likesCount)).limit(limit).offset(offset)
      : baseQuery.orderBy(asc(instagramPosts.likesCount)).limit(limit).offset(offset)
  } else if (sortBy === "comments") {
    return sortOrder === "desc"
      ? baseQuery.orderBy(desc(instagramPosts.commentsCount)).limit(limit).offset(offset)
      : baseQuery.orderBy(asc(instagramPosts.commentsCount)).limit(limit).offset(offset)
  } else {
    return sortOrder === "desc"
      ? baseQuery.orderBy(desc(instagramPosts.postDate)).limit(limit).offset(offset)
      : baseQuery.orderBy(asc(instagramPosts.postDate)).limit(limit).offset(offset)
  }
}

export async function deleteInstagramPost(id: string) {
  try {
    await db.delete(instagramPosts).where(eq(instagramPosts.id, id))
    return { success: true }
  } catch (error) {
    console.error("Failed to delete Instagram post:", error)
    return { success: false, error: "Failed to delete Instagram post" }
  }
}

export async function getInstagramPostById(id: string) {
  try {
    const [post] = await db.select().from(instagramPosts).where(eq(instagramPosts.id, id))
    return { success: true, data: post }
  } catch (error) {
    console.error("Failed to fetch Instagram post:", error)
    return { success: false, error: "Failed to fetch Instagram post" }
  }
}

export const instagramApi = {
  getInstagramPosts,
  deleteInstagramPost,
  getInstagramPostById
}