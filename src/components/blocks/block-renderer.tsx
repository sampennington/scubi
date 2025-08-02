import type { Block } from "@/lib/api"
import type { BlockWithContent } from "./types"
import { BlockType } from "@/database/schema"
import { TextBlock } from "./text-block"
import { ImageBlock } from "./image-block"
import { HeroBlock } from "./hero-block"
import { MultiColumnBlock } from "./multi-column-block"

function isBlockType<T extends Block["type"]>(
  block: Block,
  type: T
): block is Extract<BlockWithContent, { type: T }> {
  return block.type === type
}

export const BlockRenderer = ({ blocks }: { blocks: Block[] }) => {
  return (
    <div className="flex w-full flex-col">
      {blocks.map((block) => {
        if (isBlockType(block, BlockType.HERO)) {
          return <HeroBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.TEXT)) {
          return <TextBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.IMAGE)) {
          return <ImageBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.MULTI_COLUMN)) {
          return <MultiColumnBlock key={block.id} content={block.content} />
        }

        return null
      })}
    </div>
  )
}
