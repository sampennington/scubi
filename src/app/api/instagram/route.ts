import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { instagramPosts } from "@/database/schema"
import { eq, desc, asc, and } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const postType = searchParams.get("postType") || "all"
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const offset = parseInt(searchParams.get("offset") || "0")

    if (!shopId) {
      return NextResponse.json({ error: "shopId is required" }, { status: 400 })
    }

    const whereConditions = [eq(instagramPosts.shopId, shopId)]

    if (postType !== "all") {
      whereConditions.push(eq(instagramPosts.postType, postType))
    }

    const orderBy = (() => {
      const column = (() => {
        switch (sortBy) {
          case "likes":
            return instagramPosts.likesCount
          case "comments":
            return instagramPosts.commentsCount
          default:
            return instagramPosts.postDate
        }
      })()

      return sortOrder === "asc" ? asc(column) : desc(column)
    })()

    const posts = await db
      .select()
      .from(instagramPosts)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("[API] Error fetching Instagram posts:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }

    await db.delete(instagramPosts).where(eq(instagramPosts.id, postId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting Instagram post:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}