import type { TaskDefinition, TaskJobData } from "../types"
import { fetchInstagramPosts } from "@/lib/services/apify-instagram"
import { db } from "@/database/db"
import { instagramPosts } from "@/database/schema"
import { uploadRemoteFile } from "@/lib/services/uploadthing.server"
import { and, eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export interface InstagramTaskData extends TaskJobData {
  profileUrl: string
  shopId: string
}

export interface InstagramTaskResult {
  success: boolean
  postsScraped: number
  postsSaved: number
  duplicatesSkipped: number
  error?: string
}

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
      console.warn("[Instagram Task] Failed to determine file extension", { url, error })
    }
    return fallbackExt
  })()

  return `${safeBase || "instagram-media"}-${suffix}.${extension}`
}

export const instagramTaskDefinition: TaskDefinition<InstagramTaskData, InstagramTaskResult> = {
  queueName: "instagram-fetch",
  processor: async ({ data, updateProgress }) => {
    const { profileUrl, shopId } = data

    try {
      await updateProgress({
        percentage: 5,
        current: 1,
        total: 5,
        message: "Connecting to Instagram..."
      })

      console.log(`[Instagram Task] Fetching posts for shop ${shopId} from ${profileUrl}`)

      const apifyPosts = await fetchInstagramPosts(profileUrl, 12)

      await updateProgress({
        percentage: 25,
        current: 2,
        total: 5,
        message: `Found ${apifyPosts.length} posts, processing...`
      })

      let savedCount = 0
      let duplicatesSkipped = 0
      const totalPosts = apifyPosts.length

      for (let i = 0; i < apifyPosts.length; i++) {
        const post = apifyPosts[i]

        const progressPercentage = 25 + Math.floor((i / totalPosts) * 70)

        try {
          const existing = await db
            .select()
            .from(instagramPosts)
            .where(and(eq(instagramPosts.postId, post.id), eq(instagramPosts.shopId, shopId)))
            .limit(1)

          if (existing.length === 0) {
            await updateProgress({
              percentage: progressPercentage,
              current: 2 + (i / totalPosts) * 3,
              total: 5,
              message: `Processing post ${i + 1}/${totalPosts}`,
              partialResult: {
                savedCount,
                duplicatesSkipped,
                currentPost: i + 1,
                totalPosts
              }
            })

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
              postType:
                post.type === "GraphSidecar" ? "carousel" : post.isVideo ? "video" : "image",
              isVideo: post.isVideo,
              videoUrl: post.videoUrl,
              localVideoUrl: videoUpload?.url ?? post.videoUrl ?? null
            })

            savedCount++
          } else {
            duplicatesSkipped++
          }
        } catch (error) {
          console.error(`[Instagram Task] Error saving post ${post.shortCode}:`, error)
        }
      }

      await updateProgress({
        percentage: 100,
        current: 5,
        total: 5,
        message: `Successfully saved ${savedCount} posts`
      })

      console.log(
        `[Instagram Task] Saved ${savedCount} Instagram posts, skipped ${duplicatesSkipped} duplicates`
      )

      return {
        success: true,
        postsScraped: apifyPosts.length,
        postsSaved: savedCount,
        duplicatesSkipped
      }
    } catch (error) {
      console.error("[Instagram Task] Failed:", error)
      return {
        success: false,
        postsScraped: 0,
        postsSaved: 0,
        duplicatesSkipped: 0,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }
    }
  }
}
