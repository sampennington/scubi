import { heroBlockConfig } from "./hero.config"
import { type HeroContent, HeroContentSchema } from "./hero.schema"
import { defaultHeroContent } from "../../shared/defaults-index"
import { HeroBlock } from "."
import type { BlockDefinition } from "@/lib/blocks"

export const heroBlockDefinition: BlockDefinition<HeroContent> = {
  id: "hero",
  name: "Hero Section",
  description:
    "A full-width hero section with title, description, background image, and call-to-action buttons",
  category: "layout" as const,
  icon: "layout-template",
  component: HeroBlock,
  schema: HeroContentSchema,
  settings: heroBlockConfig.settings,
  defaults: defaultHeroContent,
  preview: {
    thumbnail: "/block-previews/hero.jpg",
    category: "Headers",
    tags: ["header", "banner", "cta", "hero"],
    description: "Eye-catching header section for landing pages"
  },
  version: "1.0.0"
}
