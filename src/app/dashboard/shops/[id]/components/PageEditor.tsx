"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, GripVertical, Trash2, Edit } from "lucide-react"
import { BlockType } from "@/database/schema"
import { BlockForm } from "./BlockForm"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  getBlocksByPageId,
  createBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks
} from "../actions"
import { BlockSelector } from "./BlockSelector"
import { getDefaultContent } from "./BlockForm/utils"

interface PageEditorProps {
  pageId: string
  pageTitle: string
}

export function PageEditor({ pageId, pageTitle }: PageEditorProps) {
  const [blocks, setBlocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBlockSelector, setShowBlockSelector] = useState(false)
  const [editingBlock, setEditingBlock] = useState<any>(null)
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
      content: getDefaultContent(blockType)
    })
  }

  const handleSaveBlock = async (blockData: {
    type: string
    content: Record<string, unknown>
  }) => {
    try {
      if (editingBlock.id) {
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
          order: blocks.length
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

  const handleDragEnd = async (dragResult: any) => {
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
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="group"
                    >
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
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                          <div className="text-sm text-muted-foreground">
                            {block.type === BlockType.TEXT &&
                              block.content.text}
                            {block.type === BlockType.HERO &&
                              block.content.title}
                            {block.type === BlockType.IMAGE &&
                              `Image: ${block.content.alt}`}
                            {block.type === BlockType.MULTI_COLUMN &&
                              `${block.content.columns?.length || 0} columns`}
                            {block.type === BlockType.GALLERY &&
                              `${block.content.images?.length || 0} images`}
                            {block.type === BlockType.TESTIMONIALS &&
                              `${block.content.testimonials?.length || 0} testimonials`}
                            {block.type === BlockType.TEAM &&
                              `${block.content.members?.length || 0} members`}
                            {block.type === BlockType.FAQ &&
                              `${block.content.items?.length || 0} items`}
                            {block.type === BlockType.CONTACT_FORM &&
                              `${block.content.fields?.length || 0} fields`}
                            {block.type === BlockType.CALL_TO_ACTION &&
                              block.content.title}
                            {block.type === BlockType.VIDEO &&
                              `Video: ${block.content.videoUrl}`}
                            {block.type === BlockType.MAP &&
                              `Map: ${block.content.address}`}
                            {block.type === BlockType.SOCIAL_FEED &&
                              `${block.content.platform}: ${block.content.username}`}
                            {block.type === BlockType.DIVIDER &&
                              (block.content.text || "Divider")}
                            {block.type === BlockType.TWO_COLUMN &&
                              "Two column layout"}
                            {block.type === BlockType.COURSES &&
                              `${block.content.courses?.length || 0} courses`}
                            {block.type === BlockType.MARINE_LIFE &&
                              `${block.content.items?.length || 0} items`}
                            {!block.content.text &&
                              !block.content.title &&
                              !block.content.alt &&
                              !block.content.columns &&
                              !block.content.images &&
                              !block.content.testimonials &&
                              !block.content.members &&
                              !block.content.items &&
                              !block.content.fields &&
                              !block.content.videoUrl &&
                              !block.content.address &&
                              !block.content.platform &&
                              !block.content.courses &&
                              "No preview available"}
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
        <BlockSelector
          onSelect={handleAddBlock}
          onClose={() => setShowBlockSelector(false)}
        />
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
