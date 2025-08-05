"use client"

import { updateBlock } from "@/app/dashboard/shops/[id]/actions"
import type { BlockType } from "@/database/schema"
import { createContext, useContext, useState, type ReactNode } from "react"
import { setProperty } from "dot-prop"

interface BlockEditContextType<T = Record<string, unknown>> {
  handleEdit: (fieldPath: string, value: string) => Promise<void>
  isSaving: boolean
  blockId?: string
  content: T
}

const BlockEditContext = createContext<BlockEditContextType | null>(null)

interface BlockEditProviderProps<T = Record<string, unknown>> {
  children: ReactNode
  blockId?: string
  initialContent: T
  onContentChange?: (content: T) => void
  type: BlockType
}

export const BlockEditProvider = <T extends Record<string, unknown>>({
  children,
  blockId,
  initialContent,
  onContentChange,
  type
}: BlockEditProviderProps<T>) => {
  const [localContent, setLocalContent] = useState<T>(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = async (fieldPath: string, value: string) => {
    console.log("handleEdit", fieldPath, value, blockId)
    if (!blockId) {
      return
    }

    // Optimistic update
    const updatedContent = setProperty(localContent, fieldPath, value)
    setLocalContent(updatedContent)

    // Notify parent of content change
    if (onContentChange) {
      onContentChange(updatedContent)
    }

    try {
      setIsSaving(true)
      await updateBlock(blockId, {
        content: updatedContent,
        type
      })
    } catch (error) {
      // Revert on error
      setLocalContent((prev) =>
        setProperty(
          prev,
          fieldPath,
          (initialContent as Record<string, unknown>)[fieldPath]
        )
      )
      console.error("Failed to save:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // if (!blockId) {
  //   return children
  // }

  return (
    <BlockEditContext.Provider
      value={{ handleEdit, isSaving, blockId, content: localContent }}
    >
      {children}
    </BlockEditContext.Provider>
  )
}

export const useBlockEdit = <T = Record<string, unknown>>() => {
  const context = useContext(BlockEditContext)

  if (!context) {
    throw new Error("useBlockEdit must be used within a BlockEditProvider")
  }

  return context as BlockEditContextType<T>
}
