"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Play, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { getInstagramPosts } from "@/lib/actions/instagram"
import type { InstagramPost } from "@/lib/api/instagram"
import Image from "next/image"
import { timeAgoFormat } from "@/lib/date"
import { useSite } from "@/app/preview/components/site-context"
import { toast } from "sonner"
import type { InstagramGalleryContent } from "./instagram-gallery.schema"
import { defaultInstagramGalleryContent } from "./instagram-gallery.default"
import type { Block } from "@/lib/api"
import { BlockEditProvider, useBlockEdit } from "@/components/blocks/editable/context"
import { DynamicSettings } from "@/components/blocks/shared/dynamic-settings"
import { blockRegistry } from "@/lib/blocks"
import { applyBackgroundWithExisting } from "@/components/blocks/shared/background"

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

const getAspectRatioClass = (aspectRatio: string) => {
  switch (aspectRatio) {
    case "portrait":
      return "aspect-[3/4]"
    case "landscape":
      return "aspect-[4/3]"
    case "square":
      return "aspect-square"
    default:
      return "aspect-square"
  }
}

const getGridSpacingClasses = (spacing: string, verticalSpacing: string) => {
  const spacingMap = {
    "none": "0",
    "small": "2",
    "medium": "4",
    "large": "6"
  }

  const horizontal = spacingMap[spacing as keyof typeof spacingMap] || "4"
  const vertical = spacingMap[verticalSpacing as keyof typeof spacingMap] || "4"

  const result = horizontal === vertical ? `gap-${horizontal}` : `gap-x-${horizontal} gap-y-${vertical}`

  console.log("Spacing debug:", { spacing, verticalSpacing, horizontal, vertical, result })

  return result
}

const getHoverEffectClass = (hoverEffect: string) => {
  switch (hoverEffect) {
    case "zoom":
      return "hover:scale-110 transition-transform duration-300"
    case "fade":
      return "hover:opacity-80 transition-opacity duration-300"
    case "slide":
      return "hover:-translate-y-2 transition-transform duration-300"
    default:
      return ""
  }
}

const getBorderRadiusClass = (borderRadius: string) => {
  switch (borderRadius) {
    case "none":
      return "rounded-none"
    case "small":
      return "rounded-sm"
    case "medium":
      return "rounded-lg"
    case "large":
      return "rounded-xl"
    case "full":
      return "rounded-full"
    default:
      return "rounded-lg"
  }
}

export interface InstagramGalleryBlockProps extends Block {
  content: InstagramGalleryContent
}

const InstagramGalleryBlockContent = () => {
  const { shopId, siteSettings } = useSite()
  const { content, handleEdit } = useBlockEdit<InstagramGalleryContent>()
  const [posts, setPosts] = useState<InstagramPost[]>()
  const [loading, setLoading] = useState(true)
  const [refetching, setRefetching] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const {
    title,
    description,
    background,
    layout,
    columns,
    maxPosts,
    showCaption,
    showLikes,
    showComments,
    showDate,
    showOverlay,
    hoverEffect,
    postType,
    sortBy,
    sortOrder,
    aspectRatio,
    spacing,
    verticalSpacing,
    openInNewTab,
    fullWidth,
    borderRadius,
    overlayOnHover
  } = { ...defaultInstagramGalleryContent, ...content }

  const backgroundProps = applyBackgroundWithExisting(background || { type: "none" })

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    const postsResult = await getInstagramPosts({
      shopId,
      postType,
      sortBy,
      sortOrder,
      limit: maxPosts
    })

    if (!postsResult.success) {
      setPosts([])
      setLoading(false)
      return
    }

    setPosts(postsResult.data ?? [])
    setLoading(false)
  }, [shopId, postType, sortBy, sortOrder, maxPosts])

  const handleRefetch = useCallback(async () => {
    if (!siteSettings.instagramUrl) {
      toast.error("No Instagram profile URL configured in site settings")
      return
    }

    setRefetching(true)

    try {
      const response = await fetch("/api/instagram/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profileUrl: siteSettings.instagramUrl,
          shopId
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(
          `Successfully fetched ${result.postsSaved} new posts${result.duplicatesSkipped > 0 ? `, ${result.duplicatesSkipped} duplicates skipped` : ""}`
        )
        // Refresh the posts display
        await fetchPosts()
      } else {
        toast.error(result.error || "Failed to fetch Instagram posts")
      }
    } catch (error) {
      console.error("Error refetching Instagram posts:", error)
      toast.error("Failed to fetch Instagram posts. Please try again.")
    } finally {
      setRefetching(false)
    }
  }, [siteSettings.instagramUrl, shopId, fetchPosts])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const blockConfig = blockRegistry.get("instagram-gallery")

  if (!blockConfig) {
    return null
  }

  const nextSlide = () => {
    if (posts && layout === "carousel") {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(posts.length / columns))
    }
  }

  const prevSlide = () => {
    if (posts && layout === "carousel") {
      setCurrentIndex(
        (prev) => (prev - 1 + Math.ceil(posts.length / columns)) % Math.ceil(posts.length / columns)
      )
    }
  }

  const getVisiblePosts = () => {
    if (!posts) return []
    if (layout === "grid") return posts.slice(0, maxPosts)

    const startIndex = currentIndex * columns
    return posts.slice(startIndex, startIndex + columns)
  }

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "grid",
              `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
              getSpacingClass(spacing)
            )}
          >
            {Array.from({ length: maxPosts }).map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className={cn("bg-gray-200", getAspectRatioClass(aspectRatio))} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const visiblePosts = getVisiblePosts()

  return (
    <div className="group relative">
      <DynamicSettings
        config={{
          ...blockConfig.settings,
          sections: blockConfig.settings.sections.map((section) => {
            if (section.id === "actions") {
              return {
                ...section,
                fields: section.fields.map((field) => {
                  if (field.name === "refetchPosts" && field.type === "button") {
                    return {
                      ...field,
                      loading: refetching,
                      disabled: refetching || !siteSettings.instagramUrl,
                      text: refetching ? "Fetching..." : "Refetch Posts"
                    }
                  }
                  return field
                })
              }
            }
            return section
          })
        }}
        value={content}
        onChange={handleEdit}
        title={`${blockConfig.name} Settings`}
        onAction={(action) => {
          if (action === "refetch-posts") {
            handleRefetch()
          }
        }}
      />

      <section className={cn("w-full", !fullWidth && "py-12", backgroundProps.className)} style={backgroundProps.style}>
        <div className="container mx-auto px-4">
          {(title || description) && (
            <div className="mb-12 text-center">
              {title && <h2 className="mb-4 font-bold text-3xl">{title}</h2>}
              {description && (
                <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className={cn("relative", fullWidth && "breakout-full")}>
            {layout === "carousel" && posts && posts.length > columns && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="-left-4 -translate-y-1/2 absolute top-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-lg"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="-right-4 -translate-y-1/2 absolute top-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-lg"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            <div
              className={cn(
                "grid",
                columns === 2 ? "grid-cols-1 md:grid-cols-2" :
                columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
                columns === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
                columns === 5 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-5" :
                columns === 6 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-6" :
                "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                fullWidth ? "gap-0" : getGridSpacingClasses(spacing, verticalSpacing)
              )}
            >
              {visiblePosts.map((post) => (
                <div
                  key={post.id}
                  className={cn(
                    "group/post relative overflow-hidden",
                    !fullWidth && "border-0 bg-transparent shadow-none"
                  )}
                >
                  <div
                    className={cn("relative overflow-hidden", getBorderRadiusClass(borderRadius))}
                  >
                    <div className={cn("relative", getAspectRatioClass(aspectRatio))}>
                      <Image
                        src={post.localImageUrl ?? ""}
                        alt={post.caption || "Instagram post"}
                        fill
                        className={cn("object-cover", getHoverEffectClass(hoverEffect))}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />

                      {post.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="h-8 w-8 fill-current text-white" />
                        </div>
                      )}

                      {post.postType === "carousel" && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489A2 2 0 0111.166 18H8.834a2 2 0 01-1.737-2.511L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H9.49l-.205-.515A1 1 0 008.326 11h-.652a1 1 0 00-.96.73L6.51 12H7V5h8v7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Multiple
                          </Badge>
                        </div>
                      )}

                      {(showOverlay || overlayOnHover) && (
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300",
                            overlayOnHover
                              ? "opacity-0 group-hover/post:opacity-100"
                              : "opacity-100"
                          )}
                        >
                          <div className="absolute right-0 bottom-0 left-0 p-4">
                            <div className="flex items-center justify-between text-white">
                              <div className="flex items-center space-x-4">
                                {showLikes && (
                                  <div className="flex items-center space-x-1">
                                    <Heart className="h-4 w-4" />
                                    <span className="text-sm">
                                      {(post.likesCount || 0).toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                {showComments && (
                                  <div className="flex items-center space-x-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="text-sm">
                                      {(post.commentsCount || 0).toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-white hover:text-white"
                                onClick={() => {
                                  if (openInNewTab) {
                                    window.open(post.postUrl, "_blank")
                                  } else {
                                    window.location.href = post.postUrl
                                  }
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {showCaption && post.caption && !fullWidth && (
                      <div className="p-3">
                        <p className="text-muted-foreground text-sm">
                          {truncateText(post.caption, 100)}
                        </p>
                        {showDate && (
                          <p className="mt-2 text-muted-foreground text-xs">
                            {timeAgoFormat(post.postDate.toISOString())}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {layout === "carousel" && posts && posts.length > columns && (
              <div className="mt-6 flex justify-center space-x-2">
                {Array.from({ length: Math.ceil(posts.length / columns) }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      index === currentIndex ? "bg-primary" : "bg-muted"
                    )}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export const InstagramGalleryBlock = (props: InstagramGalleryBlockProps) => {
  return (
    <BlockEditProvider {...props}>
      <InstagramGalleryBlockContent />
    </BlockEditProvider>
  )
}
