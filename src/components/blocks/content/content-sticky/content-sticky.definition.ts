import { contentStickyBlockConfig } from "./content-sticky.config"
import { type ContentStickyContent, contentStickySchema } from "./content-sticky.schema"
import { defaultContentStickyContent } from "./content-sticky.default"
import { ContentStickyBlock } from "."
import type { BlockDefinition } from "@/lib/blocks"

export const contentStickyBlockDefinition: BlockDefinition<ContentStickyContent> = {
  id: "content-sticky",
  name: "Content with Sticky Image",
  description: "A content section with sticky image layout featuring text, features list, and background graphics",
  category: "content" as const,
  icon: "layout-grid",
  component: ContentStickyBlock,
  schema: contentStickySchema,
  settings: contentStickyBlockConfig.settings,
  defaults: defaultContentStickyContent,
  preview: {
    thumbnail: "/block-previews/content-sticky.jpg",
    category: "Content",
    tags: ["content", "features", "sticky", "layout"],
    description: "Content section with sticky image and feature highlights"
  },
  version: "1.0.0"
}