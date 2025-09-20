import { instagramGalleryConfig } from "./instagram-gallery.config"
import {
  type InstagramGalleryContent,
  InstagramGalleryContentSchema
} from "./instagram-gallery.schema"
import { defaultInstagramGalleryContent } from "./instagram-gallery.default"
import { InstagramGalleryBlock } from "./instagram-gallery.component"
import type { BlockDefinition } from "@/lib/blocks"

export const instagramGalleryBlockDefinition: BlockDefinition<InstagramGalleryContent> = {
  id: "instagram-gallery",
  name: "Instagram Gallery",
  description:
    "Display Instagram posts in a beautiful grid or carousel layout with engagement stats, hover effects, and filtering options",
  category: "social" as const,
  icon: instagramGalleryConfig.icon,
  component: InstagramGalleryBlock,
  schema: InstagramGalleryContentSchema,
  settings: instagramGalleryConfig.settings,
  default: defaultInstagramGalleryContent,
  preview: {
    thumbnail: "/block-previews/instagram-gallery.jpg",
    category: "Social",
    tags: ["instagram", "social-media", "gallery", "posts", "carousel"],
    description: "Instagram posts gallery with grid and carousel layouts"
  },
  version: "1.0.0"
}
