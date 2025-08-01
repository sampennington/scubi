import type { Block } from "@/lib/api"
import type { BlockWithContent } from "./types"
import { TextBlock } from "./text-block"
import { ImageBlock } from "./image-block"
import { HeroBlock } from "./hero-block"

function isBlockType<T extends Block["type"]>(
  block: Block,
  type: T
): block is Extract<BlockWithContent, { type: T }> {
  return block.type === type
}

export const BlockRenderer = ({ blocks }: { blocks: Block[] }) => {
  return (
    <div className="block-renderer container">
      {blocks.map((block) => {
        if (isBlockType(block, "hero")) {
          return <HeroBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, "text")) {
          return <TextBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, "image")) {
          return <ImageBlock key={block.id} content={block.content} />
        }

        return null
      })}
    </div>
  )
}
