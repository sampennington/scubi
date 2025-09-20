import { runApifyActor, APIFY_ACTORS } from "@/lib/clients/apify"

interface ApifyInstagramPost {
  id: string
  shortCode: string
  caption?: string
  hashtags: string[]
  likesCount: number
  commentsCount: number
  url: string
  displayUrl: string
  timestamp: string
  type: "GraphImage" | "GraphVideo" | "GraphSidecar"
  isVideo: boolean
  videoUrl?: string
  sidecarChildren?: Array<{
    displayUrl: string
    isVideo: boolean
    videoUrl?: string
  }>
  ownerUsername: string
  ownerId: string
}

export async function fetchInstagramPosts(
  profileUrl: string,
  maxPosts = 200
): Promise<ApifyInstagramPost[]> {
  const input = {
    directUrls: [profileUrl],
    resultsType: "posts",
    resultsLimit: maxPosts,
    searchType: "hashtag",
    searchLimit: 1,
    addParentData: false
  }

  try {
    console.log("[Apify] Starting Instagram posts extraction...")

    const items = await runApifyActor<ApifyInstagramPost>({
      actorId: APIFY_ACTORS.INSTAGRAM_SCRAPER,
      input
    })

    console.log(`[Apify] Retrieved ${items.length} Instagram posts`)

    return items
  } catch (error) {
    console.error("[Apify] Error fetching Instagram posts:", error)
    throw new Error(
      `Failed to fetch Instagram posts: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}