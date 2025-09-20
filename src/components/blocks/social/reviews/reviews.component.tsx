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
import type { ReviewsContent } from "./reviews.schema"
import { defaultReviewsContent } from "./reviews.default"
import type { Block } from "@/lib/api"
import { BlockEditProvider, useBlockEdit } from "@/components/blocks/editable/context"
import { DynamicSettings } from "@/components/blocks/shared/dynamic-settings"
import { blockRegistry } from "@/lib/blocks"
import { applyBackgroundWithExisting } from "@/components/blocks/shared/background"

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
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

export interface ReviewsBlockProps extends Block {
  content: ReviewsContent
}

const ReviewsBlockContent = () => {
  const { shopId } = useSite()
  const { content, handleEdit } = useBlockEdit<ReviewsContent>()
  const [reviews, setReviews] = useState<Review[]>()
  const [aggregateRating, setAggregateRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  const {
    title,
    description,
    background,
    layout,
    columns,
    maxReviews,
    showRating,
    showPhotos,
    showVerifiedBadge,
    showDate,
    showPlatform,
    showReadMore,
    truncateLength,
    showAggregateRating,
    showReviewButton,
    reviewButtonText,
    reviewButtonUrl,
    platform,
    sortBy,
    sortOrder,
    filterRating
  } = { ...defaultReviewsContent, ...content }

  const backgroundProps = applyBackgroundWithExisting(background || { type: "none" })

  const fetchReviews = useCallback(async () => {
    setLoading(true)

    const [reviewsResult, aggregateResult] = await Promise.all([
      getReviews({
        shopId,
        platform,
        sortBy,
        sortOrder,
        filterRating,
        limit: maxReviews
      }),
      getReviewsAggregate(shopId, platform)
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
  }, [shopId, platform, sortBy, sortOrder, filterRating, maxReviews])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const blockConfig = blockRegistry.get("reviews")

  if (!blockConfig) {
    return null
  }

  if (reviews?.length === 0 && !loading) {
    return null
  }

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: maxReviews }).map((_, i) => (
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
    <div className="group relative">
      <DynamicSettings
        config={blockConfig.settings}
        value={content}
        onChange={handleEdit}
        title={`${blockConfig.name} Settings`}
      />

      <section className={cn("w-full py-12", backgroundProps.className)} style={backgroundProps.style}>
        <div className="container mx-auto px-4">
          {(title || description || showAggregateRating || showReviewButton) && (
            <div className="mb-12 text-center">
              {title && <h2 className="mb-4 font-bold text-3xl text-white">{title}</h2>}
              {description && (
                <p className="mx-auto mb-8 max-w-2xl text-lg text-teal-100">{description}</p>
              )}

              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                {showAggregateRating && (
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

                {showReviewButton && (
                  <Button
                    size="lg"
                    className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
                    onClick={() => {
                      if (reviewButtonUrl) {
                        window.open(reviewButtonUrl, "_blank")
                      }
                    }}
                  >
                    {reviewButtonText}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div
            className={cn(
              "grid gap-6",
              layout === "grid" && `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
              layout === "list" && "grid-cols-1",
              layout === "carousel" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {reviews?.slice(0, maxReviews).map((review) => (
              <Card
                key={review.id}
                className="bg-white transition-shadow duration-200 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6">
                  {showRating && (
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
                      {showReadMore
                        ? truncateText(review.reviewText, truncateLength)
                        : review.reviewText}
                    </p>
                    {showReadMore && review.reviewText.length > truncateLength && (
                      <button
                        type="button"
                        className="font-medium text-blue-600 text-sm hover:text-blue-800"
                      >
                        Read more
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {showPhotos ? (
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
                        {showVerifiedBadge && review.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-gray-500 text-xs">
                        {showDate && <span>{timeAgoFormat(review.reviewDate.toISOString())}</span>}
                        {showPlatform && (
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
    </div>
  )
}

export const ReviewsBlock = (props: ReviewsBlockProps) => {
  return (
    <BlockEditProvider {...props}>
      <ReviewsBlockContent />
    </BlockEditProvider>
  )
}
