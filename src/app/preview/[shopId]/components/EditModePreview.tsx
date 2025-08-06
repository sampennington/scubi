"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import type { Block } from "@/lib/api"
import { EditableBlock } from "./EditableBlock"
import { BlockSelector } from "@/app/dashboard/shops/[id]/components/BlockSelector"
import { createBlock, reorderBlocks } from "../actions"

interface EditModePreviewProps {
  blocks: Block[]
  pageId: string
  shopId: string
  onBlocksChange: (blocks: Block[]) => void
}

export function EditModePreview({
  blocks: initialBlocks,
  pageId,
  shopId,
  onBlocksChange
}: EditModePreviewProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [showBlockSelector, setShowBlockSelector] = useState(false)

  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  useEffect(() => {
    onBlocksChange(blocks)
  }, [blocks, onBlocksChange])

  const handleUpdateBlock = (updatedBlock: Block) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === updatedBlock.id ? updatedBlock : block))
    )
  }

  const handleDeleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId))
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const newBlocks = [...blocks]
    const block = newBlocks[index]
    const prevBlock = newBlocks[index - 1]

    // Swap order values
    const tempOrder = block.order
    block.order = prevBlock.order
    prevBlock.order = tempOrder

    // Swap positions in array
    newBlocks[index] = prevBlock
    newBlocks[index - 1] = block

    setBlocks(newBlocks)

    try {
      const blockIds = newBlocks.map((b) => b.id)
      const result = await reorderBlocks(blockIds)

      if (!result.success) {
        console.error("Failed to reorder blocks:", result.error)
        setBlocks(initialBlocks)
      }
    } catch (error) {
      console.error("Failed to reorder blocks:", error)
      setBlocks(initialBlocks)
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === blocks.length - 1) return

    const newBlocks = [...blocks]
    const block = newBlocks[index]
    const nextBlock = newBlocks[index + 1]

    // Swap order values
    const tempOrder = block.order
    block.order = nextBlock.order
    nextBlock.order = tempOrder

    // Swap positions in array
    newBlocks[index] = nextBlock
    newBlocks[index + 1] = block

    setBlocks(newBlocks)

    try {
      const blockIds = newBlocks.map((b) => b.id)
      const result = await reorderBlocks(blockIds)
      if (!result.success) {
        console.error("Failed to reorder blocks:", result.error)
        setBlocks(initialBlocks)
      }
    } catch (error) {
      console.error("Failed to reorder blocks:", error)
      setBlocks(initialBlocks)
    }
  }

  const handleAddBlock = async (blockType: string, insertIndex?: number) => {
    try {
      // Calculate new order value
      let newOrder: number
      if (insertIndex !== undefined && insertIndex < blocks.length) {
        // Insert between blocks
        const prevBlock = blocks[insertIndex]
        const nextBlock = blocks[insertIndex + 1]
        const prevOrder = prevBlock.order ?? 0
        const nextOrder = nextBlock?.order ?? prevOrder + 1
        newOrder = prevOrder + (nextOrder - prevOrder) / 2
      } else {
        // Add at the end
        const maxOrder =
          blocks.length > 0 ? Math.max(...blocks.map((b) => b.order ?? 0)) : 0
        newOrder = maxOrder + 1
      }

      const result = await createBlock({
        pageId,
        type: blockType,
        content: {},
        order: newOrder
      })

      if (result.success && result.block) {
        const newBlocks = [...blocks]
        if (insertIndex !== undefined) {
          newBlocks.splice(insertIndex + 1, 0, result.block)
        } else {
          newBlocks.push(result.block)
        }

        setBlocks(newBlocks)
        setShowBlockSelector(false)
      } else {
        alert(result.error || "Failed to create block")
      }
    } catch (error) {
      console.error("Failed to create block:", error)
      alert("Failed to create block")
    }
  }

  const handleAddBlockAtEnd = () => {
    setShowBlockSelector(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-2xl text-gray-900">Edit Page</h1>
          <p className="text-gray-600">
            Click on blocks to edit them, or add new blocks below.
          </p>
        </div>

        <div className="space-y-8">
          {blocks.map((block, index) => (
            <EditableBlock
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onAddBlock={(insertIndex) => handleAddBlock("", insertIndex)}
              shopId={shopId}
              pageId={pageId}
            />
          ))}

          <div className="flex justify-center py-8">
            <Button
              onClick={handleAddBlockAtEnd}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Block
            </Button>
          </div>
        </div>

        {showBlockSelector && (
          <BlockSelector
            onSelect={handleAddBlock}
            onClose={() => setShowBlockSelector(false)}
          />
        )}
      </div>
    </div>
  )
}
