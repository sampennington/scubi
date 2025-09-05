import type { Block } from "@/lib/api"
import { getBlockComponent } from "@/lib/blocks/registry"
import { EmptyPagePlaceholder } from "./empty-page-placeholder"
import { useSite } from "../../../app/preview/components/site-context"
import { defaultContent } from "./defaults-index"
import { Loader2 } from "lucide-react"
import type { BlockType } from "@/database/schema"
import { EditStateProvider } from "../editable/edit-state-manager"

export const BlockRenderer = () => {
  const { blocks, isLoadingLocalBlocks } = useSite()

  console.log("blocks", isLoadingLocalBlocks)

  if (isLoadingLocalBlocks && blocks.length === 0) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (blocks.length === 0) {
    return <EmptyPagePlaceholder />
  }

  return (
    <EditStateProvider>
      <div className="flex w-full flex-col">
        {blocks.map((block) => (
          <div key={block.id}>
            <BlockWithValidation block={block} />
          </div>
        ))}
      </div>
    </EditStateProvider>
  )
}

function BlockWithValidation({ block }: { block: Block }) {
  const BlockComponent = getBlockComponent(block.type as BlockType)

  if (!BlockComponent) {
    console.warn(`Unknown block type: ${block.type}`)
    return null
  }

  // Use default content as fallback if block content is invalid/missing
  const content = block.content || defaultContent[block.type as BlockType] || {}

  // @ts-ignore
  return <BlockComponent key={block.id} {...block} content={content} />
}
