import { registerBlock } from "../../../../lib/blocks/core/register-block"
import { heroBlockConfig } from "./hero.config"
import { createElement } from "react"
import { type HeroContent, HeroContentSchema } from "./hero.schema"
import { defaultHeroContent } from "../../shared/defaults-index"

// Simple wrapper component
const HeroComponent = ({ content }: { content?: HeroContent }) => {
  const data = content || defaultHeroContent
  return createElement(
    "div",
    { className: "hero-block" },
    createElement("h1", null, data.title),
    createElement("p", null, data.text)
  )
}

/**
 * Hero Block Definition
 */
export const heroBlockDefinition = {
  id: "hero",
  name: "Hero Section",
  description:
    "A full-width hero section with title, description, background image, and call-to-action buttons",
  category: "layout" as const,
  icon: "layout-template",
  component: HeroComponent,
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

// Auto-register the block
registerBlock(heroBlockDefinition)

// Export for manual registration if needed
export default heroBlockDefinition
