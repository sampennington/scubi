"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, PlusIcon } from "lucide-react"
import { useSite } from "@/app/preview/components/site-context"
import { BlockType } from "@/database/schema"
import { createBlock, updateBlockOrder } from "@/lib/actions/blocks"
import { defaultContent } from "@/components/blocks/default-data"
import { toast } from "sonner"

interface AddBlockModalProps {
  isOpen: boolean
  onClose: () => void
  onBlockAdded: () => void
  order: number | null
}

const EDITABLE_BLOCKS = [
  {
    type: BlockType.HERO,
    name: "Hero Section",
    description: "A prominent section with title, text, and call-to-action buttons",
    icon: "🎯"
  },
  {
    type: BlockType.MULTI_COLUMN,
    name: "Multi Column",
    description: "Content organized in multiple columns with headings and descriptions",
    icon: "📊"
  },
  {
    type: BlockType.TEAM,
    name: "Team",
    description: "Showcase team members with photos, roles, and contact information",
    icon: "👥"
  },
  {
    type: BlockType.CONTACT_FORM,
    name: "Contact Form",
    description: "A form for visitors to get in touch with you",
    icon: "📝"
  },
  {
    type: BlockType.COURSES,
    name: "Courses",
    description: "Display available courses with details and pricing",
    icon: "📚"
  }
]

export function AddBlockModal({ isOpen, onClose, onBlockAdded, order }: AddBlockModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { currentPage, blocks } = useSite()

  const filteredBlocks = EDITABLE_BLOCKS.filter(
    (block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateBlock = async (blockType: BlockType) => {
    setIsCreating(true)
    try {
      if (order === null) {
        throw new Error("Order is required")
      }

      const blocksToUpdate = blocks.filter((block) => (block.order ?? 0) > order)

      for (const block of blocksToUpdate) {
        const updateResult = await updateBlockOrder(block.id, (block.order ?? 0) + 1)
        if (!updateResult.success) {
          throw new Error(`Failed to update block order: ${updateResult.error}`)
        }
      }

      const result = await createBlock({
        pageId: currentPage.id,
        type: blockType,
        content: defaultContent[blockType] as Record<string, unknown>,
        order: order
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create block")
      }

      onBlockAdded()
      onClose()
    } catch (error) {
      toast.error("Failed to create block", {
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search block types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-3">
            {filteredBlocks.map((block) => (
              <div
                key={block.type}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="text-2xl">{block.icon}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm">{block.name}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">{block.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleCreateBlock(block.type)}
                  disabled={isCreating}
                  className="flex-shrink-0"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No block types found matching "{searchQuery}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
