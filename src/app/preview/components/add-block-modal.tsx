"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchIcon, PlusIcon, ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"
import { useSite } from "@/app/preview/components/site-context"
import { createBlock, updateBlockOrder } from "@/lib/actions/blocks"
import { useTask } from "@/lib/tasks/use-task"
import type { ScrapeReviewsInput, ScrapeReviewsOutput } from "@/lib/tasks/types"
import { toast } from "sonner"
import { useBlockRegistry } from "@/lib/blocks"

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
  const { currentPage, blocks, shopId } = useSite()
  const registry = useBlockRegistry()

  const task = useTask({
    onComplete: (result: unknown) => {
      const output = result as ScrapeReviewsOutput
      toast.success("Reviews scraped successfully!", {
        description: `Found ${output?.reviewsScraped || 0} reviews`
      })
      onBlockAdded()
      onClose()
      resetModalState()
    },
    onError: (error: string) => {
      toast.error("Review scraping failed", {
        description: error
      })
      onBlockAdded()
      onClose()
      resetModalState()
    }
  })

  const availableBlocks = registry.getAllBlocks()
  console.log({ availableBlocks })
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

      // Start background task to scrape reviews
      await task.startTask('scrape-reviews', {
        mapsUrl: googleProfileUrl,
        shopId
      } as ScrapeReviewsInput)

      toast.success("Reviews block created!", {
        description: "Starting to scrape reviews in the background..."
      })
    } catch (error) {
      toast.error("Failed to create reviews block", {
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsScrapingReviews(false)
    }
  }

  const resetModalState = () => {
    setShowReviewsSetup(false)
    task.disconnect()
    setGoogleProfileUrl("")
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
            {task.status === 'running' || task.status === 'paused' ? (
              "Scraping Reviews"
            ) : showReviewsSetup ? (
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
            ) : (
              "Add New Block"
            )}
          </DialogTitle>
        </DialogHeader>

        {task.taskId && (task.status === 'running' || task.status === 'paused') ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900 text-sm">Scraping Google Maps Reviews</h3>
              <p className="mt-2 text-blue-700 text-sm">
                {task.message || "We're collecting your reviews from Google Maps. This may take a few minutes."}
              </p>
            </div>

            <div className="space-y-4">
              {/* Connection status */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${task.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                {task.isConnected ? 'Connected' : 'Disconnected'}
              </div>

              {/* Progress bar */}
              {task.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{task.progress.message}</span>
                    <span>{task.progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${task.progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.progress.current} / {task.progress.total}
                  </div>
                </div>
              )}

              {/* Task controls */}
              <div className="flex gap-2">
                {task.status === 'running' && (
                  <Button variant="outline" size="sm" onClick={() => task.pauseTask()}>
                    Pause
                  </Button>
                )}
                {task.status === 'paused' && (
                  <Button variant="outline" size="sm" onClick={() => task.resumeTask()}>
                    Resume
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => task.abortTask()}>
                  Abort
                </Button>
              </div>

              {/* Status and error messages */}
              {task.error && (
                <div className="rounded-lg bg-red-50 p-3 text-red-800 text-sm">
                  <div className="font-medium">Error:</div>
                  <div>{task.error}</div>
                </div>
              )}
            </div>
          </div>
        ) : showReviewsSetup ? (
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
