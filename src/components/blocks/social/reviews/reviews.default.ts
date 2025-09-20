import type { ReviewsContent } from "./reviews.schema"

export const defaultReviewsContent: ReviewsContent = {
  title: "What Our Divers Say",
  description:
    "Read authentic reviews from fellow diving enthusiasts who have experienced our courses and dive trips.",
  background: { type: "gradient", direction: "to-br", fromColor: "#134e4a", toColor: "#115e59" },
  platform: "all",
  layout: "grid",
  columns: "3",
  maxReviews: 8,
  showRating: true,
  showPhotos: true,
  showVerifiedBadge: true,
  showDate: true,
  showPlatform: false,
  showReadMore: true,
  truncateLength: 150,
  showAggregateRating: true,
  showReviewButton: true,
  reviewButtonText: "Review us on Google",
  reviewButtonUrl: "https://g.page/r/your-business/review",
  sortBy: "date",
  sortOrder: "desc",
  filterRating: "all"
}
