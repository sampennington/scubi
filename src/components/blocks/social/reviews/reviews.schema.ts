import { z } from "zod"

export const ReviewsContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  platform: z.enum(["all", "google", "tripadvisor", "facebook", "yelp"]),
  layout: z.enum(["grid", "carousel", "list"]),
  columns: z.enum(["1", "2", "3", "4"]),
  maxReviews: z.number().min(1).max(50),
  showRating: z.boolean(),
  showPhotos: z.boolean(),
  showVerifiedBadge: z.boolean(),
  showDate: z.boolean(),
  showPlatform: z.boolean(),
  showReadMore: z.boolean(),
  truncateLength: z.number().min(50).max(500),
  showAggregateRating: z.boolean(),
  showReviewButton: z.boolean(),
  reviewButtonText: z.string(),
  reviewButtonUrl: z.string().optional(),
  sortBy: z.enum(["date", "rating", "helpful"]),
  sortOrder: z.enum(["desc", "asc"]),
  filterRating: z.enum(["all", "5", "4", "3", "2", "1"])
})

export type ReviewsContent = z.infer<typeof ReviewsContentSchema>

export function isReviewsContent(data: unknown): data is ReviewsContent {
  return ReviewsContentSchema.safeParse(data).success
}
