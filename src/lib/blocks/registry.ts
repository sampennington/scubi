import { BlockType } from "@/database/schema"
import { HeroBlock } from "@/components/blocks/layout/hero"
import { registerBlocks } from "./core/register-block"
import { heroBlockDefinition } from "@/components/blocks/layout/hero/hero.definition"

export const blockComponents = {
  [BlockType.HERO]: HeroBlock
} as const

export type BlockComponentType = keyof typeof blockComponents

export function getBlockComponent(blockType: BlockType) {
  return blockComponents[blockType as BlockComponentType]
}

export function isValidBlockType(blockType: string): blockType is BlockType {
  return blockType in blockComponents
}

registerBlocks([heroBlockDefinition])
