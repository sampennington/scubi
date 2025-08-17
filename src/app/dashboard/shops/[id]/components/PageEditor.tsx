"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, GripVertical, Trash2, Edit } from "lucide-react"
import { BlockForm } from "./BlockForm"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { getBlocksByPageId, createBlock, updateBlock, deleteBlock, reorderBlocks } from "../actions"
import { BlockSelector } from "./BlockSelector"
import { getBlockPreview, getDefaultContent } from "./BlockForm/utils"
import type { Block } from "@/lib/api"
import type { BlockType } from "@/database/schema"

interface PageEditorProps {
  pageId: string
  pageTitle: string
}

export function PageEditor({ pageId, pageTitle }: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [showBlockSelector, setShowBlockSelector] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [showBlockForm, setShowBlockForm] = useState(false)

  const loadBlocks = useCallback(async () => {
    try {
      setLoading(true)
      const pageBlocks = await getBlocksByPageId(pageId)
      setBlocks(pageBlocks)
    } catch (error) {
      console.error("Error loading blocks:", error)
    } finally {
      setLoading(false)
    }
  }, [pageId])

  useEffect(() => {
    loadBlocks()
  }, [loadBlocks])

  const handleAddBlock = async (blockType: string) => {
    setShowBlockSelector(false)
    setShowBlockForm(true)
    setEditingBlock({
      type: blockType,
      content: getDefaultContent(blockType),
      pageId,
      id: "",
      updatedAt: new Date(),
      order: null
    })
  }

  const handleSaveBlock = async (blockData: {
    type: BlockType
    content: Record<string, unknown>
  }) => {
    try {
      if (editingBlock?.id) {
        // Update existing block
        const result = await updateBlock(editingBlock.id, {
          type: blockData.type,
          content: blockData.content
        })
        if (!result.success) {
          console.error("Error updating block:", result.error)
          return
        }
      } else {
        // Create new block
        const result = await createBlock({
          pageId,
          type: blockData.type,
          content: blockData.content,
          order: blocks.length + 1
        })
        if (!result.success) {
          console.error("Error creating block:", result.error)
          return
        }
      }
      await loadBlocks()
      setShowBlockForm(false)
      setEditingBlock(null)
    } catch (error) {
      console.error("Error saving block:", error)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    try {
      const result = await deleteBlock(blockId)
      if (!result.success) {
        console.error("Error deleting block:", result.error)
        return
      }
      await loadBlocks()
    } catch (error) {
      console.error("Error deleting block:", error)
    }
  }

  const handleDragEnd = async (dragResult: DropResult) => {
    if (!dragResult.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(dragResult.source.index, 1)
    items.splice(dragResult.destination.index, 0, reorderedItem)

    setBlocks(items)

    // Update order in database
    const blockIds = items.map((block) => block.id)
    const reorderResult = await reorderBlocks(blockIds)
    if (!reorderResult.success) {
      console.error("Error reordering blocks:", reorderResult.error)
    }
  }

  const getBlockTypeLabel = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return <div>Loading blocks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Page: {pageTitle}</h3>
        <Button onClick={() => setShowBlockSelector(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Block
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="group">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div className="flex items-center space-x-2">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-sm">
                              {getBlockTypeLabel(block.type)}
                            </CardTitle>
                            <Badge variant="secondary">{block.type}</Badge>
                          </div>
                          <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingBlock(block)
                                setShowBlockForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBlock(block.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-muted-foreground text-sm">
                            {getBlockPreview(block)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {blocks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">No blocks added yet</p>
            <Button onClick={() => setShowBlockSelector(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Block
            </Button>
          </CardContent>
        </Card>
      )}

      {showBlockSelector && (
        <BlockSelector onSelect={handleAddBlock} onClose={() => setShowBlockSelector(false)} />
      )}

      {showBlockForm && editingBlock && (
        <BlockForm
          block={editingBlock}
          onSave={handleSaveBlock}
          onCancel={() => {
            setShowBlockForm(false)
            setEditingBlock(null)
          }}
        />
      )}
    </div>
  )
}
