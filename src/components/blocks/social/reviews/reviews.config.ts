import { Star } from "lucide-react"
import type { BlockConfig } from "@/lib/blocks/core/config-types"
import { defaultReviewsContent } from "./reviews.default"
import { ReviewsContentSchema } from "./reviews.schema"
import { backgroundSettingsSection } from "../../shared/background"

export const reviewsBlockConfig: BlockConfig = {
  id: "reviews",
  name: "Reviews",
  description:
    "Display customer reviews and ratings from various platforms with customizable layouts and filtering",
  category: "social",
  icon: Star,
  schema: ReviewsContentSchema,
  default: defaultReviewsContent,
  preview: {
    thumbnail: "/block-previews/reviews.jpg",
    category: "Social",
    tags: ["reviews", "testimonials", "ratings", "social-proof"],
    description: "Customer reviews with ratings and platform integration"
  },
  settings: {
    sections: [
      {
        id: "content",
        title: "Content",
        description: "Section heading and description",
        fields: [
          {
            type: "text",
            name: "title",
            label: "Section Title",
            description: "Main headline for the reviews section",
            placeholder: "What Our Divers Say",
            maxLength: 100,
            defaultValue: "What Our Divers Say"
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            description: "Supporting text below the title",
            placeholder: "Read authentic reviews from fellow diving enthusiasts...",
            rows: 2,
            maxLength: 200,
            defaultValue:
              "Read authentic reviews from fellow diving enthusiasts who have experienced our courses and dive trips."
          }
        ]
      },
      backgroundSettingsSection,
      {
        id: "layout",
        title: "Layout & Display",
        description: "How reviews are displayed and organized",
        fields: [
          {
            type: "select",
            name: "layout",
            label: "Display Layout",
            description: "Choose how reviews are arranged",
            options: [
              { value: "grid", label: "Grid Layout" },
              { value: "carousel", label: "Carousel Layout" },
              { value: "list", label: "List Layout" }
            ],
            defaultValue: "grid"
          },
          {
            type: "select",
            name: "columns",
            label: "Grid Columns",
            description: "Number of columns in grid layout",
            options: [
              { value: "1", label: "1 Column" },
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" }
            ],
            defaultValue: "3",
            conditions: [
              {
                field: "layout",
                operator: "equals",
                value: "grid"
              }
            ]
          },
          {
            type: "range",
            name: "maxReviews",
            label: "Maximum Reviews",
            description: "Maximum number of reviews to display",
            min: 1,
            max: 50,
            step: 1,
            defaultValue: 8
          }
        ]
      },
      {
        id: "visual",
        title: "Visual Elements",
        description: "Control what information is displayed",
        fields: [
          {
            type: "toggle",
            name: "showRating",
            label: "Show Rating Stars",
            description: "Display star ratings for each review",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showPhotos",
            label: "Show Profile Photos",
            description: "Display reviewer profile photos or initials",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showVerifiedBadge",
            label: "Show Verified Badge",
            description: "Display verified reviewer badges",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showDate",
            label: "Show Review Date",
            description: "Display when the review was posted",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showPlatform",
            label: "Show Platform Badge",
            description: "Display platform source (Google, TripAdvisor, etc.)",
            defaultValue: false
          }
        ]
      },
      {
        id: "content-display",
        title: "Review Content",
        description: "How review text is displayed",
        fields: [
          {
            type: "toggle",
            name: "showReadMore",
            label: "Truncate Long Reviews",
            description: "Show 'read more' for lengthy reviews",
            defaultValue: true
          },
          {
            type: "range",
            name: "truncateLength",
            label: "Text Length Limit",
            description: "Maximum characters before truncation",
            min: 50,
            max: 500,
            step: 10,
            defaultValue: 150,
            conditions: [
              {
                field: "showReadMore",
                operator: "equals",
                value: true
              }
            ]
          }
        ]
      },
      {
        id: "aggregate",
        title: "Summary Rating",
        description: "Overall rating display and review button",
        fields: [
          {
            type: "toggle",
            name: "showAggregateRating",
            label: "Show Overall Rating",
            description: "Display aggregate rating summary",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showReviewButton",
            label: "Show Review Button",
            description: "Display button for customers to leave reviews",
            defaultValue: true
          },
          {
            type: "text",
            name: "reviewButtonText",
            label: "Button Text",
            description: "Text for the review button",
            placeholder: "Review us on Google",
            maxLength: 50,
            defaultValue: "Review us on Google",
            conditions: [
              {
                field: "showReviewButton",
                operator: "equals",
                value: true
              }
            ]
          },
          {
            type: "url",
            name: "reviewButtonUrl",
            label: "Button URL",
            description: "Link where customers can leave reviews",
            placeholder: "https://g.page/r/your-business/review",
            defaultValue: "",
            conditions: [
              {
                field: "showReviewButton",
                operator: "equals",
                value: true
              }
            ]
          }
        ]
      },
      {
        id: "filtering",
        title: "Filtering & Sorting",
        description: "How reviews are filtered and organized",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "select",
            name: "platform",
            label: "Platform Filter",
            description: "Show reviews from specific platforms",
            options: [
              { value: "all", label: "All Platforms" },
              { value: "google", label: "Google Only" },
              { value: "tripadvisor", label: "TripAdvisor Only" },
              { value: "facebook", label: "Facebook Only" },
              { value: "yelp", label: "Yelp Only" }
            ],
            defaultValue: "all"
          },
          {
            type: "select",
            name: "sortBy",
            label: "Sort Reviews By",
            description: "Primary sorting criteria",
            options: [
              { value: "date", label: "Date" },
              { value: "rating", label: "Rating" },
              { value: "helpful", label: "Helpful Count" }
            ],
            defaultValue: "date"
          },
          {
            type: "select",
            name: "sortOrder",
            label: "Sort Order",
            description: "Ascending or descending order",
            options: [
              { value: "desc", label: "Newest First" },
              { value: "asc", label: "Oldest First" }
            ],
            defaultValue: "desc"
          },
          {
            type: "select",
            name: "filterRating",
            label: "Minimum Rating",
            description: "Only show reviews with this rating or higher",
            options: [
              { value: "all", label: "All Ratings" },
              { value: "5", label: "5 Stars Only" },
              { value: "4", label: "4+ Stars" },
              { value: "3", label: "3+ Stars" },
              { value: "2", label: "2+ Stars" },
              { value: "1", label: "1+ Stars" }
            ],
            defaultValue: "all"
          }
        ]
      }
    ]
  },
  version: "1.0.0"
}
