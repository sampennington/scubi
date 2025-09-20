import { runApifyActor, APIFY_ACTORS } from "@/lib/clients/apify"

interface ApifyReview {
  searchString: string
  reviewerId: string
  reviewerUrl: string
  name: string
  reviewerNumberOfReviews: number
  isLocalGuide: boolean
  reviewerPhotoUrl: string | null
  text: string
  textTranslated: string | null
  publishAt: string
  publishedAtDate: string
  likesCount: number
  reviewId: string
  reviewUrl: string
  reviewOrigin: string
  stars: number
  rating: number | null
  responseFromOwnerDate: string | null
  responseFromOwnerText: string | null
  reviewImageUrls: string[]
  reviewContext: Record<string, unknown>
  reviewDetailedRating: Record<string, unknown>
  visitedIn: string | null
  originalLanguage: string
  translatedLanguage: string | null
  isAdvertisement: boolean
  placeId: string
  location: { lat: number; lng: number }
  address: string
  neighborhood: string
  street: string
  city: string
  postalCode: string
  state: string
  countryCode: string
  categoryName: string
  categories: string[]
  title: string
  totalScore: number
  permanentlyClosed: boolean
  temporarilyClosed: boolean
  reviewsCount: number
  url: string
  price: string | null
  cid: string
  fid: string
  imageUrl: string
  scrapedAt: string
  language: string
}

export async function fetchGoogleMapsReviews(
  mapsUrl: string,
  maxReviews = 50
): Promise<ApifyReview[]> {
  const input = {
    startUrls: [{ url: mapsUrl }],
    maxReviews,
    reviewsSort: "newest",
    language: "en",
    reviewsOrigin: "all",
    personalData: true
  }

  try {
    console.log("[Apify] Starting Google Maps reviews extraction...")

    const items = await runApifyActor<ApifyReview>({
      actorId: APIFY_ACTORS.GOOGLE_MAPS_SCRAPER,
      input
    })

    console.log(`[Apify] Retrieved ${items.length} reviews`)

    return items
  } catch (error) {
    console.error("[Apify] Error fetching reviews:", error)
    throw new Error(
      `Failed to fetch reviews: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}
