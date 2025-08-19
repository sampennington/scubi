"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  BlockSettingsPanel,
  SettingsSection,
  SettingItem
} from "@/components/editable/settings-panel"
import { useBlockEdit } from "../../context"
import type { ReviewsContent } from "@/components/blocks/schemas"

export default function ReviewsSettingsPanel() {
  const { content, handleEdit } = useBlockEdit<ReviewsContent>()

  const {
    title = "",
    description = "",
    layout = "grid",
    columns = "3",
    maxReviews = 10,
    showRating = true,
    showPhotos = true,
    showVerifiedBadge = true,
    showDate = true,
    showPlatform = true,
    showReadMore = false,
    truncateLength = 150,
    showAggregateRating = true,
    showReviewButton = false,
    reviewButtonText = "",
    reviewButtonUrl = "",
    platform = "all",
    sortBy = "date",
    sortOrder = "desc",
    filterRating = "all"
  } = content

  return (
    <BlockSettingsPanel title="Reviews Block Settings">
      <SettingsSection title="Content">
        <SettingItem label="Title" description="Section title">
          <input
            type="text"
            value={title}
            onChange={(e) => handleEdit("title", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter reviews section title"
          />
        </SettingItem>

        <SettingItem label="Description" description="Section description">
          <textarea
            value={description}
            onChange={(e) => handleEdit("description", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter reviews section description"
            rows={3}
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Layout">
        <SettingItem label="Display Style" description="Choose how reviews are displayed">
          <Select
            value={layout}
            onValueChange={(value: "grid" | "carousel" | "list") => handleEdit("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid Layout</SelectItem>
              <SelectItem value="carousel">Carousel Layout</SelectItem>
              <SelectItem value="list">List Layout</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem label="Columns" description="Number of columns in grid layout">
          <Select
            value={columns}
            onValueChange={(value: "1" | "2" | "3" | "4") => handleEdit("columns", value)}
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
        </SettingItem>

        <SettingItem label="Max Reviews" description="Maximum number of reviews to display">
          <input
            type="number"
            min="1"
            max="50"
            value={maxReviews}
            onChange={(e) => handleEdit("maxReviews", parseInt(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Visual Elements">
        <SettingItem label="Show Rating Stars" description="Display star ratings">
          <Switch
            checked={showRating}
            onCheckedChange={(checked) => handleEdit("showRating", checked)}
          />
        </SettingItem>

        <SettingItem label="Show Profile Photos" description="Display reviewer profile photos">
          <Switch
            checked={showPhotos}
            onCheckedChange={(checked) => handleEdit("showPhotos", checked)}
          />
        </SettingItem>

        <SettingItem label="Show Verified Badge" description="Display verified reviewer badges">
          <Switch
            checked={showVerifiedBadge}
            onCheckedChange={(checked) => handleEdit("showVerifiedBadge", checked)}
          />
        </SettingItem>

        <SettingItem label="Show Review Date" description="Display review dates">
          <Switch
            checked={showDate}
            onCheckedChange={(checked) => handleEdit("showDate", checked)}
          />
        </SettingItem>

        <SettingItem label="Show Platform Badge" description="Display platform source badges">
          <Switch
            checked={showPlatform}
            onCheckedChange={(checked) => handleEdit("showPlatform", checked)}
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Review Content">
        <SettingItem
          label="Show Read More"
          description="Truncate long reviews with read more option"
        >
          <Switch
            checked={showReadMore}
            onCheckedChange={(checked) => handleEdit("showReadMore", checked)}
          />
        </SettingItem>

        {showReadMore && (
          <SettingItem label="Text Length" description="Character limit before truncation">
            <input
              type="number"
              min="50"
              max="500"
              value={truncateLength}
              onChange={(e) => handleEdit("truncateLength", parseInt(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </SettingItem>
        )}

        <SettingItem label="Show Aggregate Rating" description="Display overall rating summary">
          <Switch
            checked={showAggregateRating}
            onCheckedChange={(checked) => handleEdit("showAggregateRating", checked)}
          />
        </SettingItem>

        <SettingItem label="Show Review Button" description="Display button to submit new reviews">
          <Switch
            checked={showReviewButton}
            onCheckedChange={(checked) => handleEdit("showReviewButton", checked)}
          />
        </SettingItem>

        {showReviewButton && (
          <>
            <SettingItem label="Button Text" description="Text displayed on the review button">
              <input
                type="text"
                value={reviewButtonText}
                onChange={(e) => handleEdit("reviewButtonText", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="Review us on Google"
              />
            </SettingItem>

            <SettingItem label="Button URL" description="Link for the review button">
              <input
                type="url"
                value={reviewButtonUrl || ""}
                onChange={(e) => handleEdit("reviewButtonUrl", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="https://google.com"
              />
            </SettingItem>
          </>
        )}
      </SettingsSection>

      <Separator />

      <SettingsSection title="Filtering & Sorting">
        <SettingItem label="Platform Filter" description="Filter reviews by source platform">
          <Select
            value={platform}
            onValueChange={(value: "all" | "google" | "tripadvisor" | "facebook" | "yelp") =>
              handleEdit("platform", value)
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
        </SettingItem>

        <SettingItem label="Sort By" description="Primary sorting criteria">
          <Select
            value={sortBy}
            onValueChange={(value: "date" | "rating" | "helpful") => handleEdit("sortBy", value)}
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
        </SettingItem>

        <SettingItem label="Sort Order" description="Ascending or descending order">
          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => handleEdit("sortOrder", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem label="Rating Filter" description="Minimum rating to display">
          <Select
            value={filterRating}
            onValueChange={(value: "all" | "5" | "4" | "3" | "2" | "1") =>
              handleEdit("filterRating", value)
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
        </SettingItem>
      </SettingsSection>
    </BlockSettingsPanel>
  )
}
