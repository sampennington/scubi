import { type NextRequest, NextResponse } from "next/server"
import { fetchInstagramPosts } from "@/lib/services/apify-instagram"
import { db } from "@/database/db"
import { instagramPosts } from "@/database/schema"
import { uploadRemoteFile } from "@/lib/services/uploadthing.server"
import { and, eq } from "drizzle-orm"
import { nanoid } from "nanoid"

const createFileName = (base: string, suffix: string, url: string, fallbackExt: string) => {
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  const extension = (() => {
    try {
      const parsed = new URL(url)
      const pathExt = parsed.pathname.split(".").pop()
      if (pathExt && /^[a-z0-9]{1,5}$/i.test(pathExt)) {
        return pathExt.toLowerCase()
      }
    } catch (error) {
      console.warn("[API] Failed to determine file extension", { url, error })
    }
    return fallbackExt
  })()

  return `${safeBase || "instagram-media"}-${suffix}.${extension}`
}

export async function POST(request: NextRequest) {
  try {
    const { profileUrl, shopId } = await request.json()

    if (!profileUrl || !shopId) {
      return NextResponse.json({ error: "profileUrl and shopId are required" }, { status: 400 })
    }

    console.log(`[API] Fetching Instagram posts for shop ${shopId} from ${profileUrl}`)

    const apifyPosts = await fetchInstagramPosts(profileUrl, 50)

    let savedCount = 0
    let duplicatesSkipped = 0

    for (const post of apifyPosts) {
      try {
        const existing = await db
          .select()
          .from(instagramPosts)
          .where(and(eq(instagramPosts.postId, post.id), eq(instagramPosts.shopId, shopId)))
          .limit(1)

        if (existing.length === 0) {
          const fileBase = post.shortCode || post.id

          const imageUpload = await uploadRemoteFile(post.displayUrl, {
            name: createFileName(fileBase, "image", post.displayUrl, "jpg")
          })

          const videoUpload =
            post.isVideo && post.videoUrl
              ? await uploadRemoteFile(post.videoUrl, {
                  name: createFileName(fileBase, "video", post.videoUrl, "mp4")
                })
              : null

          // For carousel posts, we could store all URLs but for now just use the main image
          // TODO: Add carousel URLs storage to schema if needed

          await db.insert(instagramPosts).values({
            id: nanoid(),
            shopId,
            postId: post.id,
            shortcode: post.shortCode,
            profileUrl,
            ownerId: post.ownerId,
            ownerUsername: post.ownerUsername,
            imageUrl: post.displayUrl,
            localImageUrl: imageUpload?.url,
            caption: post.caption || "",
            hashtags: post.hashtags || [],
            likesCount: post.likesCount || 0,
            commentsCount: post.commentsCount || 0,
            postUrl: post.url,
            postDate: new Date(post.timestamp),
            postType: post.type === "GraphSidecar" ? "carousel" : post.isVideo ? "video" : "image",
            isVideo: post.isVideo,
            videoUrl: post.videoUrl,
            localVideoUrl: videoUpload?.url ?? post.videoUrl ?? null
          })

          savedCount++
        } else {
          duplicatesSkipped++
        }
      } catch (error) {
        console.error(`[API] Error saving Instagram post ${post.shortCode}:`, error)
      }
    }

    console.log(
      `[API] Saved ${savedCount} Instagram posts, skipped ${duplicatesSkipped} duplicates`
    )

    return NextResponse.json({
      success: true,
      postsScraped: apifyPosts.length,
      postsSaved: savedCount,
      duplicatesSkipped,
      message: `Successfully fetched and saved ${savedCount} Instagram posts`
    })
  } catch (error) {
    console.error("[API] Error fetching Instagram posts:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
