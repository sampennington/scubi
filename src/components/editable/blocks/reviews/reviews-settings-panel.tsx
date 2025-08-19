"use client"

import { useState } from "react"
import type { ReviewsContent } from "@/components/blocks/schemas"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ReviewsSettingsPanelProps = {
  content: ReviewsContent
  onUpdate: (content: ReviewsContent) => void
}

export default function ReviewsSettingsPanel({ content, onUpdate }: ReviewsSettingsPanelProps) {
  const [localContent, setLocalContent] = useState<ReviewsContent>(content)

  const updateContent = (updates: Partial<ReviewsContent>) => {
    const newContent = { ...localContent, ...updates }
    setLocalContent(newContent)
    onUpdate(newContent)
  }

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={localContent.title || ""}
            onChange={(e) => updateContent({ title: e.target.value })}
            placeholder="Enter title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={localContent.description || ""}
            onChange={(e) => updateContent({ description: e.target.value })}
            placeholder="Enter description"
          />
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="display" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Layout Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={localContent.layout}
                    onValueChange={(value: "grid" | "carousel" | "list") =>
                      updateContent({ layout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="columns">Columns</Label>
                  <Select
                    value={localContent.columns}
                    onValueChange={(value: "1" | "2" | "3" | "4") =>
                      updateContent({ columns: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="maxReviews">Max Reviews</Label>
                <Input
                  id="maxReviews"
                  type="number"
                  min="1"
                  max="50"
                  value={localContent.maxReviews}
                  onChange={(e) => updateContent({ maxReviews: parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Visual Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showRating">Show Rating Stars</Label>
                <Switch
                  id="showRating"
                  checked={localContent.showRating}
                  onCheckedChange={(checked) => updateContent({ showRating: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showPhotos">Show Profile Photos</Label>
                <Switch
                  id="showPhotos"
                  checked={localContent.showPhotos}
                  onCheckedChange={(checked) => updateContent({ showPhotos: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showVerifiedBadge">Show Verified Badge</Label>
                <Switch
                  id="showVerifiedBadge"
                  checked={localContent.showVerifiedBadge}
                  onCheckedChange={(checked) => updateContent({ showVerifiedBadge: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showDate">Show Review Date</Label>
                <Switch
                  id="showDate"
                  checked={localContent.showDate}
                  onCheckedChange={(checked) => updateContent({ showDate: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showPlatform">Show Platform Badge</Label>
                <Switch
                  id="showPlatform"
                  checked={localContent.showPlatform}
                  onCheckedChange={(checked) => updateContent({ showPlatform: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Review Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showReadMore">Show Read More</Label>
                <Switch
                  id="showReadMore"
                  checked={localContent.showReadMore}
                  onCheckedChange={(checked) => updateContent({ showReadMore: checked })}
                />
              </div>

              {localContent.showReadMore && (
                <div>
                  <Label htmlFor="truncateLength">Text Length (characters)</Label>
                  <Input
                    id="truncateLength"
                    type="number"
                    min="50"
                    max="500"
                    value={localContent.truncateLength}
                    onChange={(e) => updateContent({ truncateLength: parseInt(e.target.value) })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="showAggregateRating">Show Aggregate Rating</Label>
                <Switch
                  id="showAggregateRating"
                  checked={localContent.showAggregateRating}
                  onCheckedChange={(checked) => updateContent({ showAggregateRating: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showReviewButton">Show Review Button</Label>
                <Switch
                  id="showReviewButton"
                  checked={localContent.showReviewButton}
                  onCheckedChange={(checked) => updateContent({ showReviewButton: checked })}
                />
              </div>

              {localContent.showReviewButton && (
                <>
                  <div>
                    <Label htmlFor="reviewButtonText">Button Text</Label>
                    <Input
                      id="reviewButtonText"
                      value={localContent.reviewButtonText}
                      onChange={(e) => updateContent({ reviewButtonText: e.target.value })}
                      placeholder="Review us on Google"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reviewButtonUrl">Button URL</Label>
                    <Input
                      id="reviewButtonUrl"
                      value={localContent.reviewButtonUrl || ""}
                      onChange={(e) => updateContent({ reviewButtonUrl: e.target.value })}
                      placeholder="https://google.com"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filtering & Sorting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="platform">Platform Filter</Label>
                <Select
                  value={localContent.platform}
                  onValueChange={(value: "all" | "google" | "tripadvisor" | "facebook" | "yelp") =>
                    updateContent({ platform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="google">Google Only</SelectItem>
                    <SelectItem value="tripadvisor">TripAdvisor Only</SelectItem>
                    <SelectItem value="facebook">Facebook Only</SelectItem>
                    <SelectItem value="yelp">Yelp Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sortBy">Sort By</Label>
                  <Select
                    value={localContent.sortBy}
                    onValueChange={(value: "date" | "rating" | "helpful") =>
                      updateContent({ sortBy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="helpful">Helpful Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Select
                    value={localContent.sortOrder}
                    onValueChange={(value: "asc" | "desc") => updateContent({ sortOrder: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="filterRating">Rating Filter</Label>
                <Select
                  value={localContent.filterRating}
                  onValueChange={(value: "all" | "5" | "4" | "3" | "2" | "1") =>
                    updateContent({ filterRating: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars Only</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                    <SelectItem value="1">1+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Auto-Refresh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoRefresh">Enable Auto-Refresh</Label>
                <Switch
                  id="autoRefresh"
                  checked={localContent.autoRefresh}
                  onCheckedChange={(checked) => updateContent({ autoRefresh: checked })}
                />
              </div>

              {localContent.autoRefresh && (
                <div>
                  <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="300"
                    max="86400"
                    value={localContent.refreshInterval}
                    onChange={(e) => updateContent({ refreshInterval: parseInt(e.target.value) })}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Min: 5 minutes, Max: 24 hours
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
