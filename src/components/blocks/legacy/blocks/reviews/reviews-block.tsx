"use client"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, ExternalLink, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getReviews, getReviewsAggregate } from "@/lib/actions/reviews"
import type { Review } from "@/lib/api/reviews"
import Image from "next/image"
import { timeAgoFormat } from "@/lib/date"
import { useSite } from "@/app/preview/components/site-context"
import { BlockEditProvider, useBlockEdit } from "@/components/blocks/editable/context"
import { BlockType } from "@/database/schema"
import type { Block } from "@/lib/api"
import { defaultReviewsContent } from "@/components/blocks/shared/defaults-index"
import ReviewsSettingsPanel from "./reviews-settings-panel"
import { ReviewsContent } from "@/components/blocks/shared/schemas"

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "google":
      return "G"
    case "tripadvisor":
      return "T"
    case "facebook":
      return "F"
    case "yelp":
      return "Y"
    default:
      return "R"
  }
}

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-teal-400"
  ]

  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const mockReviews: Review[] = [
  {
    id: "1",
    rating: 5,
    reviewText: "This is a review",
    platform: "google",
    reviewerName: "John Doe",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 10,
    reviewUrl: "https://example.com",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  },

  {
    id: "2",
    rating: 4,
    reviewText: "This is a review",
    platform: "google",
    reviewerName: "Jane Doe",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 10,
    reviewUrl: "https://example.com",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  },
  {
    id: "3",
    rating: 3,
    reviewText: "This is a review",
    platform: "google",
    reviewerName: "Jim Doe",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 10,
    reviewUrl: "https://example.com",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  },
  {
    id: "4",
    rating: 5,
    reviewText: "Amazing experience! Highly recommend this place.",
    platform: "tripadvisor",
    reviewerName: "Alice Smith",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 15,
    reviewUrl: "https://example.com",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  },
  {
    id: "5",
    rating: 4,
    reviewText: "Great service and friendly staff. Will come back!",
    platform: "facebook",
    reviewerName: "Bob Johnson",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 8,
    reviewUrl: "https://example.com",
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  },
  {
    id: "6",
    rating: 5,
    reviewText: "Absolutely fantastic experience! The staff went above and beyond.",
    platform: "yelp",
    reviewerName: "Charlie Wilson",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 12,
    reviewUrl: "https://example.com",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  },
  {
    id: "7",
    rating: 4,
    reviewText: "Really enjoyed our time here. Great atmosphere and service.",
    platform: "google",
    reviewerName: "Diana Brown",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 6,
    reviewUrl: "https://example.com",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  },
  {
    id: "8",
    rating: 5,
    reviewText: "Excellent quality and very professional team. Highly recommend!",
    platform: "tripadvisor",
    reviewerName: "Ethan Davis",
    reviewerPhoto: "",
    reviewDate: new Date(),
    helpfulCount: 9,
    reviewUrl: "https://example.com",
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    shopId: "1",
    externalId: "1",
    language: "en"
  }
]

export function ReviewsBlockContent() {
  const { shopId } = useSite()
  const { content } = useBlockEdit<ReviewsContent>()
  const [reviews, setReviews] = useState<Review[]>()
  const [aggregateRating, setAggregateRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    setLoading(true)

    const [reviewsResult, aggregateResult] = await Promise.all([
      getReviews({
        shopId,
        platform: content.platform,
        sortBy: content.sortBy,
        sortOrder: content.sortOrder,
        filterRating: content.filterRating,
        limit: content.maxReviews
      }),
      getReviewsAggregate(shopId, content.platform)
    ])

    if (!reviewsResult.success || !aggregateResult.success) {
      setReviews([])
      setAggregateRating(0)
      setTotalReviews(0)
      setLoading(false)
      return
    }

    setReviews(reviewsResult.data ?? [])
    setAggregateRating(aggregateResult.data?.avgRating || 0)
    setTotalReviews(aggregateResult.data?.totalReviews || 0)

    setLoading(false)
  }, [
    shopId,
    content.platform,
    content.sortBy,
    content.sortOrder,
    content.filterRating,
    content.maxReviews
  ])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  if (reviews?.length === 0 && !loading) {
    return null
  }

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: content.maxReviews }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="space-y-4 p-6">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="h-4 w-4 rounded bg-gray-200" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="space-y-1">
                      <div className="h-3 w-20 rounded bg-gray-200" />
                      <div className="h-3 w-16 rounded bg-gray-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="group relative w-full bg-gradient-to-br from-teal-900 to-teal-800 py-12">
      <ReviewsSettingsPanel />
      <div className="container mx-auto px-4">
        {(content.title ||
          content.description ||
          content.showAggregateRating ||
          content.showReviewButton) && (
          <div className="mb-12 text-center">
            {content.title && (
              <h2 className="mb-4 font-bold text-3xl text-white">{content.title}</h2>
            )}
            {content.description && (
              <p className="mx-auto mb-8 max-w-2xl text-lg text-teal-100">{content.description}</p>
            )}

            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              {content.showAggregateRating && (
                <div className="flex items-center space-x-4">
                  <div className="font-bold text-6xl text-white">{aggregateRating}</div>
                  <div className="flex flex-col">
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-6 w-6",
                            i < Math.floor(aggregateRating)
                              ? "fill-current text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-teal-100">{totalReviews} reviews on Google</p>
                  </div>
                </div>
              )}

              {content.showReviewButton && (
                <Button
                  size="lg"
                  className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
                  onClick={() => {
                    if (content.reviewButtonUrl) {
                      window.open(content.reviewButtonUrl, "_blank")
                    }
                  }}
                >
                  {content.reviewButtonText}
                </Button>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            "grid gap-6",
            content.layout === "grid" &&
              `grid-cols-1 md:grid-cols-2 lg:grid-cols-${content.columns}`,
            content.layout === "list" && "grid-cols-1",
            content.layout === "carousel" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {reviews?.slice(0, content.maxReviews).map((review) => (
            <Card
              key={review.id}
              className="bg-white transition-shadow duration-200 hover:shadow-lg"
            >
              <CardContent className="space-y-4 p-6">
                {content.showRating && (
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {content.showReadMore
                      ? truncateText(review.reviewText, content.truncateLength)
                      : review.reviewText}
                  </p>
                  {content.showReadMore && review.reviewText.length > content.truncateLength && (
                    <button
                      type="button"
                      className="font-medium text-blue-600 text-sm hover:text-blue-800"
                    >
                      Read more
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {content.showPhotos ? (
                    review.reviewerPhoto ? (
                      <Image
                        src={review.reviewerPhoto}
                        alt={review.reviewerName}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm text-white",
                          getAvatarColor(review.reviewerName)
                        )}
                      >
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </div>
                    )
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="truncate font-semibold text-gray-900">
                        {review.reviewerName}
                      </span>
                      {content.showVerifiedBadge && review.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-gray-500 text-xs">
                      {content.showDate && (
                        <span>{timeAgoFormat(review.reviewDate.toISOString())}</span>
                      )}
                      {content.showPlatform && (
                        <Badge variant="secondary" className="text-xs">
                          {review.platform}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {review.reviewUrl && (
                  <div className="flex items-center justify-between border-gray-100 border-t pt-2">
                    <div className="flex items-center space-x-2 text-gray-500 text-xs">
                      <MessageCircle className="h-3 w-3" />
                      <span>{review.helpfulCount} helpful</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        if (review.reviewUrl) {
                          window.open(review.reviewUrl, "_blank")
                        }
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ReviewsBlock({
  content = defaultReviewsContent,
  blockId,
  ...props
}: Block & {
  content?: ReviewsContent
  blockId?: string
}) {
  return (
    <BlockEditProvider<ReviewsContent>
      blockId={blockId}
      {...props}
      content={content}
      type={BlockType.REVIEWS}
    >
      <ReviewsBlockContent />
    </BlockEditProvider>
  )
}
