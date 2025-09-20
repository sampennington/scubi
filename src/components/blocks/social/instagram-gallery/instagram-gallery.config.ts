import { Instagram } from "lucide-react"
import type { BlockConfig } from "@/lib/blocks/core/config-types"
import { defaultInstagramGalleryContent } from "./instagram-gallery.default"
import { InstagramGalleryContentSchema } from "./instagram-gallery.schema"
import { backgroundSettingsSection } from "../../shared/background"

export const instagramGalleryConfig: BlockConfig = {
  id: "instagram-gallery",
  name: "Instagram Gallery",
  description: "Display Instagram posts in a beautiful grid or carousel layout",
  category: "social",
  icon: Instagram,
  schema: InstagramGalleryContentSchema,
  default: defaultInstagramGalleryContent,
  preview: {
    thumbnail: "/block-previews/instagram-gallery.jpg",
    category: "Social",
    tags: ["instagram", "social-media", "gallery", "posts", "carousel"],
    description: "Instagram posts gallery with grid and carousel layouts"
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
            description: "Main headline for the Instagram gallery",
            placeholder: "Follow Us on Instagram",
            maxLength: 100,
            defaultValue: "Follow Us on Instagram"
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            description: "Supporting text below the title",
            placeholder: "Check out our latest diving adventures...",
            rows: 2,
            maxLength: 200,
            defaultValue: "Check out our latest diving adventures and underwater photography"
          }
        ]
      },
      backgroundSettingsSection,
      {
        id: "layout",
        title: "Layout & Display",
        description: "How Instagram posts are displayed and organized",
        fields: [
          {
            type: "select",
            name: "layout",
            label: "Display Layout",
            description: "Choose how posts are arranged",
            options: [
              { value: "grid", label: "Grid Layout" },
              { value: "carousel", label: "Carousel Layout" }
            ],
            defaultValue: "grid"
          },
          {
            type: "select",
            name: "columns",
            label: "Grid Columns",
            description: "Number of columns in grid layout",
            options: [
              { value: 2, label: "2 Columns" },
              { value: 3, label: "3 Columns" },
              { value: 4, label: "4 Columns" },
              { value: 5, label: "5 Columns" },
              { value: 6, label: "6 Columns" }
            ],
            defaultValue: 4,
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
            name: "maxPosts",
            label: "Maximum Posts",
            description: "Maximum number of posts to display",
            min: 1,
            max: 50,
            step: 1,
            defaultValue: 12
          },
          {
            type: "select",
            name: "aspectRatio",
            label: "Image Aspect Ratio",
            description: "How images are cropped",
            options: [
              { value: "square", label: "Square" },
              { value: "portrait", label: "Portrait (3:4)" },
              { value: "landscape", label: "Landscape (4:3)" },
              { value: "original", label: "Original" }
            ],
            defaultValue: "square"
          },
          {
            type: "select",
            name: "spacing",
            label: "Horizontal Spacing",
            description: "Space between images horizontally",
            options: [
              { value: "none", label: "No Spacing" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" }
            ],
            defaultValue: "medium"
          },
          {
            type: "select",
            name: "verticalSpacing",
            label: "Vertical Spacing",
            description: "Space between image rows",
            options: [
              { value: "none", label: "No Spacing" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" }
            ],
            defaultValue: "medium"
          },
          {
            type: "toggle",
            name: "fullWidth",
            label: "Full Width",
            description: "Take up entire page width with no padding",
            defaultValue: false
          },
          {
            type: "select",
            name: "borderRadius",
            label: "Border Radius",
            description: "Rounding of image corners",
            options: [
              { value: "none", label: "No Rounding" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Full Circle" }
            ],
            defaultValue: "medium"
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
            name: "showCaption",
            label: "Show Captions",
            description: "Display post captions below images",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showLikes",
            label: "Show Like Count",
            description: "Display number of likes on hover",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showComments",
            label: "Show Comment Count",
            description: "Display number of comments on hover",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "showDate",
            label: "Show Post Date",
            description: "Display when the post was published",
            defaultValue: false
          },
          {
            type: "toggle",
            name: "showOverlay",
            label: "Show Hover Overlay",
            description: "Display overlay with stats on hover",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "openInNewTab",
            label: "Open in New Tab",
            description: "Open Instagram posts in new tab when clicked",
            defaultValue: true
          },
          {
            type: "toggle",
            name: "overlayOnHover",
            label: "Overlay Only on Hover",
            description: "Show stats overlay only when hovering over images",
            defaultValue: false
          }
        ]
      },
      {
        id: "styling",
        title: "Styling & Effects",
        description: "Visual styling options",
        fields: [
          {
            type: "select",
            name: "hoverEffect",
            label: "Hover Effect",
            description: "Animation when hovering over posts",
            options: [
              { value: "zoom", label: "Zoom In" },
              { value: "fade", label: "Fade" },
              { value: "slide", label: "Slide Up" },
              { value: "none", label: "None" }
            ],
            defaultValue: "zoom"
          }
        ]
      },
      {
        id: "filtering",
        title: "Filtering & Sorting",
        description: "How posts are filtered and organized",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "select",
            name: "postType",
            label: "Post Type Filter",
            description: "Show specific types of posts",
            options: [
              { value: "all", label: "All Posts" },
              { value: "image", label: "Images Only" },
              { value: "video", label: "Videos Only" },
              { value: "carousel", label: "Carousels Only" }
            ],
            defaultValue: "all"
          },
          {
            type: "select",
            name: "sortBy",
            label: "Sort Posts By",
            description: "Primary sorting criteria",
            options: [
              { value: "date", label: "Date" },
              { value: "likes", label: "Likes" },
              { value: "comments", label: "Comments" }
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
          }
        ]
      },
      {
        id: "actions",
        title: "Actions",
        description: "Manual operations for Instagram posts",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "button",
            name: "refetchPosts",
            label: "Refetch Instagram Posts",
            text: "Refetch Posts",
            action: "refetch-posts",
            variant: "outline",
            description: "Manually fetch the latest posts from your Instagram profile"
          }
        ]
      }
    ]
  },
  version: "1.0.0"
}
