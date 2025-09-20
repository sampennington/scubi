import { type NextRequest, NextResponse } from "next/server"
import { fetchGoogleMapsReviews } from "@/lib/services/apify-reviews"
import { db } from "@/database/db"
import { reviews } from "@/database/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const { mapsUrl, shopId } = await request.json()

    if (!mapsUrl || !shopId) {
      return NextResponse.json({ error: "mapsUrl and shopId are required" }, { status: 400 })
    }

    console.log(`[API] Fetching reviews for shop ${shopId} from ${mapsUrl}`)

    const apifyReviews = await fetchGoogleMapsReviews(mapsUrl, 50)

    let savedCount = 0
    let duplicatesSkipped = 0

    for (const review of apifyReviews) {
      try {
        const existing = await db
          .select()
          .from(reviews)
          .where(eq(reviews.reviewId, review.reviewId))
          .limit(1)

        if (existing.length === 0) {
          await db.insert(reviews).values({
            id: nanoid(),
            shopId,
            platform: "google",
            reviewId: review.reviewId,
            reviewerName: review.name,
            reviewerPhoto: review.reviewerPhotoUrl,
            rating: review.stars,
            reviewText: review.text || "",
            reviewDate: new Date(review.publishedAtDate),
            verified: review.isLocalGuide,
            helpfulCount: review.likesCount,
            reviewUrl: review.reviewUrl,
            language: review.originalLanguage || "en"
          })

          savedCount++
        } else {
          duplicatesSkipped++
        }
      } catch (error) {
        console.error(`[API] Error saving review from ${review.name}:`, error)
      }
    }

    console.log(`[API] Saved ${savedCount} reviews, skipped ${duplicatesSkipped} duplicates`)

    return NextResponse.json({
      success: true,
      reviewsScraped: apifyReviews.length,
      reviewsSaved: savedCount,
      duplicatesSkipped,
      message: `Successfully fetched and saved ${savedCount} reviews`
    })
  } catch (error) {
    console.error("[API] Error fetching reviews:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
