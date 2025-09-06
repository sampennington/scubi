import { reviewsBlockConfig } from "./reviews.config"
import { type ReviewsContent, ReviewsContentSchema } from "./reviews.schema"
import { defaultReviewsContent } from "./reviews.default"
import { ReviewsBlock } from "./reviews.component"
import type { BlockDefinition } from "@/lib/blocks"

export const reviewsBlockDefinition: BlockDefinition<ReviewsContent> = {
  id: "reviews",
  name: "Reviews",
  description:
    "Display customer reviews and ratings from various platforms with customizable layouts and filtering",
  category: "social" as const,
  icon: reviewsBlockConfig.icon,
  component: ReviewsBlock,
  schema: ReviewsContentSchema,
  settings: reviewsBlockConfig.settings,
  default: defaultReviewsContent,
  preview: {
    thumbnail: "/block-previews/reviews.jpg",
    category: "Social",
    tags: ["reviews", "testimonials", "ratings", "social-proof"],
    description: "Customer reviews with ratings and platform integration"
  },
  version: "1.0.0"
}
