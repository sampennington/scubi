"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Edit3Icon,
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  GripVerticalIcon
} from "lucide-react"
import type { Block } from "@/lib/api/types"
import { BlockRenderer } from "@/components/blocks/block-renderer"
import { BlockForm } from "@/app/dashboard/shops/[id]/components/BlockForm"
import { BlockSelector } from "@/app/dashboard/shops/[id]/components/BlockSelector"
import { updateBlock, deleteBlock, createBlock } from "../actions"
import type { BlockType } from "@/database/schema"

interface EditableBlockProps {
  block: Block
  index: number
  totalBlocks: number
  onUpdate: (updatedBlock: Block) => void
  onDelete: (blockId: string) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onAddBlock: (index: number) => void
  shopId: string
  pageId: string
}

export function EditableBlock({
  block,
  index,
  totalBlocks,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  shopId,
  pageId
}: EditableBlockProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showBlockSelector, setShowBlockSelector] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this block?")) {
      setIsDeleting(true)
      try {
        const result = await deleteBlock(block.id)
        if (result.success) {
          onDelete(block.id)
        } else {
          alert(result.error || "Failed to delete block")
        }
      } catch (error) {
        console.error("Failed to delete block:", error)
        alert("Failed to delete block")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleSaveBlock = async (blockData: {
    type: BlockType
    content: Record<string, unknown>
  }) => {
    try {
      const result = await updateBlock(block.id, {
        type: blockData.type,
        content: blockData.content
      })
      console.log({ result })
      // if (result.success && result.data) {
      //   onUpdate(result.data)
      //   setShowEditForm(false)
      // } else {
      //   alert(result.error || "Failed to update block")
      // }
    } catch (error) {
      console.error("Failed to update block:", error)
      alert("Failed to update block")
    }
  }

  const handleAddBlock = async (blockType: string) => {
    try {
      const result = await createBlock({
        pageId,
        type: blockType,
        content: {},
        order: index + 1
      })
      if (result.success) {
        onAddBlock(index)
        setShowBlockSelector(false)
      } else {
        alert(result.error || "Failed to create block")
      }
    } catch (error) {
      console.error("Failed to create block:", error)
      alert("Failed to create block")
    }
  }

  return (
    <div className="group relative">
      {/* Render the actual block content */}
      <div className="relative">
        <BlockRenderer blocks={[block]} />

        {/* Overlay controls - visible on hover */}
        <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-center gap-1 rounded-lg border bg-white/95 p-2 shadow-lg backdrop-blur-sm">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit3Icon className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-6 w-px bg-gray-300" />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronUpIcon className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMoveDown(index)}
              disabled={index === totalBlocks - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Drag handle - always visible */}
        <div className="absolute top-4 left-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="rounded-lg border bg-white/95 p-2 shadow-lg backdrop-blur-sm">
            <GripVerticalIcon className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Add block button - between blocks */}
      <div className="relative">
        <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBlockSelector(true)}
            className="border bg-white shadow-lg"
          >
            + Add Block
          </Button>
        </div>
      </div>

      {/* Edit Form Dialog */}
      {showEditForm && (
        <BlockForm
          block={{
            ...block,
            type: block.type as BlockType,
            content: block.content as Record<string, unknown>
          }}
          onSave={handleSaveBlock}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {/* Block Selector Dialog */}
      {showBlockSelector && (
        <BlockSelector
          onSelect={handleAddBlock}
          onClose={() => setShowBlockSelector(false)}
        />
      )}
    </div>
  )
}
