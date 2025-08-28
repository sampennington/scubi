import { statsBlockConfig } from "./stats.config"
import { type StatsContent, StatsContentSchema } from "./stats.schema"
import { defaultStatsContent } from "./stats.default"
import { StatsBlock } from "."
import type { BlockDefinition } from "@/lib/blocks"

export const statsBlockDefinition: BlockDefinition<StatsContent> = {
  id: "stats",
  name: "Stats",
  description: "Display statistics in a grid layout with editable values and labels",
  category: "content" as const,
  icon: statsBlockConfig.icon,
  component: StatsBlock,
  schema: StatsContentSchema,
  settings: statsBlockConfig.settings,
  default: defaultStatsContent,
  preview: {
    thumbnail: "/block-previews/stats.jpg",
    category: "Content",
    tags: ["stats", "numbers", "metrics", "data"],
    description: "Showcase impressive statistics and key metrics"
  },
  version: "1.0.0"
}
