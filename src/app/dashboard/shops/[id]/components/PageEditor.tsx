"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, GripVertical, Trash2, Edit } from "lucide-react"
import { BlockType } from "@/database/schema"
import { BlockSelector } from "./BlockSelector"
import { BlockForm } from "./BlockForm"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  getBlocksByPageId,
  createBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks
} from "../actions"

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

  const handleSaveBlock = async (blockData: any) => {
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

  const getDefaultContent = (blockType: string) => {
    switch (blockType) {
      case BlockType.HERO:
        return {
          title: "Welcome to our site",
          text: "Discover amazing experiences with us",
          image: "/demo-img.png",
          primaryButton: {
            label: "Get Started",
            url: "#",
            variant: "secondary"
          },
          secondaryButton: { label: "Learn More", url: "#", variant: "outline" }
        }
      case BlockType.TEXT:
        return { text: "Enter your text here", alignment: "left" }
      case BlockType.IMAGE:
        return { src: "/demo-img.png", alt: "Image description" }
      case BlockType.MULTI_COLUMN:
        return {
          title: "Our Services",
          description: "What we offer",
          columns: [
            { heading: "Service 1", body: "Description of service 1" },
            { heading: "Service 2", body: "Description of service 2" },
            { heading: "Service 3", body: "Description of service 3" }
          ],
          columnsPerRow: 3,
          alignment: "center",
          showIcons: true
        }
      case BlockType.GALLERY:
        return {
          title: "Our Gallery",
          description: "Check out our latest photos",
          images: [
            { src: "/demo-img.png", alt: "Gallery image 1" },
            { src: "/demo-img.png", alt: "Gallery image 2" },
            { src: "/demo-img.png", alt: "Gallery image 3" }
          ],
          layout: "grid",
          columns: 3,
          showCaptions: false
        }
      case BlockType.TESTIMONIALS:
        return {
          title: "What Our Customers Say",
          description: "Read testimonials from our satisfied customers",
          testimonials: [
            {
              name: "John Doe",
              role: "Customer",
              company: "ABC Company",
              content: "Amazing experience! Highly recommended.",
              rating: 5,
              photo: "/demo-img.png"
            }
          ],
          layout: "grid",
          columns: 3,
          showPhotos: true,
          showRatings: true
        }
      case BlockType.TEAM:
        return {
          title: "Our Team",
          description: "Meet the people behind our success",
          members: [
            {
              name: "Jane Smith",
              role: "Founder & CEO",
              bio: "Passionate about creating amazing experiences.",
              photo: "/demo-img.png",
              email: "jane@example.com",
              phone: "+1-555-0123"
            }
          ],
          layout: "grid",
          columns: 3,
          showContactInfo: false,
          showSocialLinks: false,
          fullWidthPhoto: false
        }
      case BlockType.FAQ:
        return {
          title: "Frequently Asked Questions",
          description: "Find answers to common questions",
          items: [
            {
              question: "What services do you offer?",
              answer:
                "We offer a wide range of diving services including training, equipment rental, and guided tours."
            }
          ],
          layout: "accordion",
          allowMultipleOpen: false
        }
      case BlockType.CONTACT_FORM:
        return {
          title: "Contact Us",
          description: "Get in touch with us",
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            {
              name: "message",
              label: "Message",
              type: "textarea",
              required: true
            }
          ],
          submitButtonText: "Send Message",
          successMessage: "Thank you for your message!",
          emailTo: "contact@example.com"
        }
      case BlockType.CALL_TO_ACTION:
        return {
          title: "Ready to Get Started?",
          description: "Join us for an amazing adventure",
          primaryButton: { label: "Book Now", url: "#", variant: "secondary" },
          secondaryButton: {
            label: "Learn More",
            url: "#",
            variant: "outline"
          },
          alignment: "center"
        }
      case BlockType.VIDEO:
        return {
          title: "Watch Our Video",
          description: "See what we're all about",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          provider: "youtube",
          autoplay: false,
          controls: true
        }
      case BlockType.MAP:
        return {
          title: "Find Us",
          description: "Visit our location",
          address: "123 Main St, City, State 12345",
          zoom: 15,
          height: 400,
          showMarker: true
        }
      case BlockType.SOCIAL_FEED:
        return {
          title: "Follow Us",
          description: "Stay updated with our latest posts",
          platform: "instagram",
          username: "yourusername",
          postCount: 9,
          layout: "grid",
          columns: 3,
          showCaptions: true
        }
      case BlockType.DIVIDER:
        return {
          text: "Section Divider",
          alignment: "center",
          style: "solid",
          thickness: 1
        }
      case BlockType.TWO_COLUMN:
        return {
          title: "Two Column Layout",
          description: "Content in two columns",
          content: {
            leftContent: {
              type: "text",
              title: "Left Column",
              content: "This is the left column content."
            },
            rightContent: {
              type: "text",
              title: "Right Column",
              content: "This is the right column content."
            },
            layout: "text-text",
            alignment: "top",
            spacing: 0
          }
        }
      case BlockType.COURSES:
        return {
          title: "Our Courses",
          description: "Learn from the best",
          courses: [
            {
              title: "Open Water Course",
              description: "Learn the basics of scuba diving",
              duration: "3-4 days",
              level: "beginner",
              price: 299,
              currency: "USD"
            }
          ],
          layout: "grid",
          columns: 2,
          showPricing: true,
          showLevels: true
        }
      case BlockType.MARINE_LIFE:
        return {
          title: "Marine Life",
          description: "Discover underwater creatures",
          items: [
            {
              name: "Sea Turtle",
              description: "Gentle giants of the sea",
              season: "year-round",
              difficulty: "easy",
              depth: "5-30m"
            }
          ],
          currentSeason: "summer",
          layout: "grid",
          columns: 3,
          showSeasonalFilter: true
        }
      default:
        return {}
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
            <p className="text-muted-foreground mb-4">No blocks added yet</p>
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
