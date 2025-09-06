import { BlockType } from "@/database/schema"
import { HeroBlock } from "@/components/blocks/layout/hero"
import { ContentStickyBlock } from "@/components/blocks/content/content-sticky"
import { StatsBlock } from "@/components/blocks/content/stats"
import { ReviewsBlock } from "@/components/blocks/social/reviews"
import { registerBlocks } from "./core/register-block"
import { heroBlockDefinition } from "@/components/blocks/layout/hero/hero.definition"
import { contentStickyBlockDefinition } from "@/components/blocks/content/content-sticky/content-sticky.definition"
import { statsBlockDefinition } from "@/components/blocks/content/stats/stats.definition"
import { reviewsBlockDefinition } from "@/components/blocks/social/reviews/reviews.definition"

export const blockComponents = {
  [BlockType.HERO]: HeroBlock,
  [BlockType.CONTENT_STICKY]: ContentStickyBlock,
  [BlockType.STATS]: StatsBlock,
  [BlockType.REVIEWS]: ReviewsBlock
} as const

export type BlockComponentType = keyof typeof blockComponents

export function getBlockComponent(blockType: BlockType) {
  return blockComponents[blockType as BlockComponentType]
}

export function isValidBlockType(blockType: string): blockType is BlockType {
  return blockType in blockComponents
}

// @ts-ignore Cannot make this work!!
registerBlocks(
  heroBlockDefinition,
  contentStickyBlockDefinition,
  statsBlockDefinition,
  reviewsBlockDefinition
)
