"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { SearchIcon, PlusIcon, ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"
import { useSite } from "@/app/preview/components/site-context"
import { createBlock, updateBlockOrder } from "@/lib/actions/blocks"
import { toast } from "sonner"
import { useBlockRegistry } from "@/lib/blocks"
import { useTask } from "@/lib/tasks/use-task"
import type { InstagramTaskResult } from "@/lib/queue/tasks/instagram"

interface AddBlockModalProps {
  isOpen: boolean
  onClose: () => void
  onBlockAdded: () => void
  order: number
}

export function AddBlockModal({ isOpen, onClose, onBlockAdded, order }: AddBlockModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [showReviewsSetup, setShowReviewsSetup] = useState(false)
  const [googleProfileUrl, setGoogleProfileUrl] = useState("")
  const [isScrapingReviews, setIsScrapingReviews] = useState(false)
  const [showInstagramSetup, setShowInstagramSetup] = useState(false)
  const [instagramProfileUrl, setInstagramProfileUrl] = useState("")
  const { currentPage, blocks, shopId } = useSite()
  const registry = useBlockRegistry()

  const instagramTask = useTask<InstagramTaskResult>({
    onComplete: (result) => {
      if (result.success) {
        toast.success("Instagram gallery created!", {
          description: `Fetched ${result.postsSaved} posts successfully`
        })
        onBlockAdded()
        handleClose()
      }
    },
    onError: (error) => {
      toast.error("Failed to fetch Instagram posts", {
        description: error
      })
    }
  })

  const availableBlocks = registry.getAllBlocks()
  const filteredBlocks = availableBlocks.filter(
    (block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateBlock = async (blockType: string) => {
    // Special handling for reviews block
    if (blockType === "reviews") {
      setShowReviewsSetup(true)
      return
    }

    // Special handling for Instagram gallery block
    if (blockType === "instagram-gallery") {
      setShowInstagramSetup(true)
      return
    }

    setIsCreating(true)
    try {
      const blockConfig = registry.get(blockType)
      if (!blockConfig) {
        throw new Error(`Block type ${blockType} not found in registry`)
      }

      const blocksToUpdate = blocks.filter((block) => (block.order ?? 0) >= order)

      for (const block of blocksToUpdate) {
        const updateResult = await updateBlockOrder(block.id, (block.order ?? 0) + 1)
        if (!updateResult.success) {
          throw new Error(`Failed to update block order: ${updateResult.error}`)
        }
      }

      const result = await createBlock({
        pageId: currentPage.id,
        type: blockType,
        content: blockConfig.default || {},
        order
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create block")
      }

      onBlockAdded()
      onClose()
    } catch (error) {
      toast.error("Failed to create block", {
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleReviewsSetup = async () => {
    if (!googleProfileUrl.trim()) {
      toast.error("Please enter your Google Maps URL")
      return
    }

    setIsScrapingReviews(true)
    try {
      const blockConfig = registry.get("reviews")
      if (!blockConfig) {
        throw new Error("Reviews block not found in registry")
      }

      const blocksToUpdate = blocks.filter((block) => (block.order ?? 0) >= order)

      for (const block of blocksToUpdate) {
        const updateResult = await updateBlockOrder(block.id, (block.order ?? 0) + 1)
        if (!updateResult.success) {
          throw new Error(`Failed to update block order: ${updateResult.error}`)
        }
      }

      const reviewsContent = {
        ...blockConfig.default,
        reviewButtonUrl: googleProfileUrl,
        title: "Customer Reviews",
        description: "See what our customers are saying about us"
      }

      const result = await createBlock({
        pageId: currentPage.id,
        type: "reviews",
        content: reviewsContent,
        order
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create reviews block")
      }

      const reviewsResponse = await fetch("/api/reviews/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mapsUrl: googleProfileUrl,
          shopId
        })
      })

      const reviewsData = await reviewsResponse.json()

      if (!reviewsResponse.ok || !reviewsData.success) {
        throw new Error(reviewsData.error || "Failed to fetch reviews")
      }

      toast.success("Reviews block created!", {
        description: `Fetched ${reviewsData.reviewsSaved} reviews successfully!`
      })
    } catch (error) {
      toast.error("Failed to create reviews block", {
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsScrapingReviews(false)
    }
  }

  const handleInstagramSetup = async () => {
    if (!instagramProfileUrl.trim()) {
      toast.error("Please enter your Instagram profile URL")
      return
    }

    try {
      const blockConfig = registry.get("instagram-gallery")
      if (!blockConfig) {
        throw new Error("Instagram gallery block not found in registry")
      }

      const blocksToUpdate = blocks.filter((block) => (block.order ?? 0) >= order)

      for (const block of blocksToUpdate) {
        const updateResult = await updateBlockOrder(block.id, (block.order ?? 0) + 1)
        if (!updateResult.success) {
          throw new Error(`Failed to update block order: ${updateResult.error}`)
        }
      }

      const instagramContent = {
        ...blockConfig.default,
        title: "Follow Us on Instagram",
        description: "Check out our latest diving adventures and underwater photography"
      }

      const result = await createBlock({
        pageId: currentPage.id,
        type: "instagram-gallery",
        content: instagramContent,
        order
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create Instagram gallery block")
      }

      await instagramTask.startTask("instagram-fetch", {
        profileUrl: instagramProfileUrl,
        shopId
      })
    } catch (error) {
      toast.error("Failed to create Instagram gallery", {
        description: error instanceof Error ? error.message : "Unknown error"
      })
    }
  }

  const resetModalState = () => {
    setShowReviewsSetup(false)
    setGoogleProfileUrl("")
    setShowInstagramSetup(false)
    setInstagramProfileUrl("")
    setSearchQuery("")
  }

  const handleClose = () => {
    resetModalState()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {showReviewsSetup ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReviewsSetup(false)}
                  className="h-auto p-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                Setup Reviews Block
              </div>
            ) : showInstagramSetup ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstagramSetup(false)}
                  className="h-auto p-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                Setup Instagram Gallery
              </div>
            ) : (
              "Add New Block"
            )}
          </DialogTitle>
        </DialogHeader>

        {showReviewsSetup ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900 text-sm">
                Connect Your Google Maps Listing
              </h3>
              <p className="mt-2 text-blue-700 text-sm">
                We'll automatically scrape and display your Google reviews to build trust with your
                customers.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="google-url" className="font-medium text-sm">
                Google Maps URL
              </Label>
              <Input
                id="google-url"
                placeholder="https://www.google.com/maps/place/Your+Business+Name/..."
                value={googleProfileUrl}
                onChange={(e) => setGoogleProfileUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-muted-foreground text-xs">
                Paste the full Google Maps URL for your business listing
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <ExternalLinkIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium text-sm">How to find your Google Maps URL:</h4>
                  <ol className="space-y-1 text-muted-foreground text-xs">
                    <li>1. Go to Google Maps and search for your business</li>
                    <li>2. Click on your business listing</li>
                    <li>3. Click the "Share" button</li>
                    <li>4. Copy the link and paste it above</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReviewsSetup(false)}
                disabled={isScrapingReviews}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewsSetup}
                disabled={isScrapingReviews || !googleProfileUrl.trim()}
              >
                {isScrapingReviews ? "Setting up reviews..." : "Create Reviews Block"}
              </Button>
            </div>
          </div>
        ) : showInstagramSetup ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-purple-50 p-4">
              <h3 className="font-semibold text-purple-900 text-sm">
                Connect Your Instagram Profile
              </h3>
              <p className="mt-2 text-purple-700 text-sm">
                We'll automatically fetch and display your Instagram posts to showcase your diving
                adventures.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="instagram-url" className="font-medium text-sm">
                Instagram Profile URL
              </Label>
              <Input
                id="instagram-url"
                placeholder="https://www.instagram.com/your-username/"
                value={instagramProfileUrl}
                onChange={(e) => setInstagramProfileUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-muted-foreground text-xs">
                Paste your Instagram profile URL (e.g., https://www.instagram.com/your-username/)
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <ExternalLinkIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium text-sm">How to find your Instagram URL:</h4>
                  <ol className="space-y-1 text-muted-foreground text-xs">
                    <li>1. Go to Instagram and open your profile</li>
                    <li>2. Copy the URL from your browser address bar</li>
                    <li>3. Paste it above (should look like: instagram.com/your-username)</li>
                  </ol>
                </div>
              </div>
            </div>

            {(instagramTask.status === "active" || instagramTask.status === "waiting") && (
              <div className="space-y-2 rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-purple-900">{instagramTask.message}</span>
                  {instagramTask.progress && (
                    <span className="font-semibold text-purple-900">
                      {Math.round(instagramTask.progress.percentage)}%
                    </span>
                  )}
                </div>
                <Progress value={instagramTask.progress?.percentage ?? 0} className="h-2" />
                {instagramTask.progress?.partialResult &&
                typeof instagramTask.progress.partialResult === "object" &&
                instagramTask.progress.partialResult !== null ? (
                  <div className="flex gap-4 text-purple-700 text-xs">
                    <span>
                      Saved:{" "}
                      {(instagramTask.progress.partialResult as { savedCount?: number })
                        .savedCount ?? 0}
                    </span>
                    <span>
                      Duplicates:{" "}
                      {(instagramTask.progress.partialResult as { duplicatesSkipped?: number })
                        .duplicatesSkipped ?? 0}
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setShowInstagramSetup(false)}
                disabled={instagramTask.status === "active" || instagramTask.status === "waiting"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInstagramSetup}
                disabled={
                  instagramTask.status === "active" ||
                  instagramTask.status === "waiting" ||
                  !instagramProfileUrl.trim()
                }
              >
                {instagramTask.status === "active" || instagramTask.status === "waiting"
                  ? instagramTask.message || "Setting up Instagram gallery..."
                  : "Create Instagram Gallery"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search block types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-3">
              {filteredBlocks.map((block) => {
                const Icon = block.icon
                return (
                  <div
                    key={block.id}
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                  >
                    {Icon && <div className="text-2xl">{<Icon />}</div>}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm">{block.name}</h3>
                      <p className="mt-1 text-muted-foreground text-sm">{block.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCreateBlock(block.id)}
                      disabled={isCreating}
                      className="flex-shrink-0"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )
              })}
            </div>

            {filteredBlocks.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No block types found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
