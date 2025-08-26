import { registerBlock } from "../core/register-block"
import { HeroContentSchema } from "../schemas"
import { heroBlockConfig } from "../configs/hero.config"
import { defaultHeroContent } from "@/components/blocks/layout/hero/defaults"
import type { HeroContent } from "../schemas"
import { createElement } from "react"

// Simple wrapper component
const HeroComponent = ({ content }: { content?: HeroContent }) => {
  const data = content || defaultHeroContent
  return createElement('div', { className: 'hero-block' },
    createElement('h1', null, data.title),
    createElement('p', null, data.text)
  )
}

/**
 * Hero Block Definition
 */
export const heroBlockDefinition = {
  id: "hero",
  name: "Hero Section", 
  description: "A full-width hero section with title, description, background image, and call-to-action buttons",
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