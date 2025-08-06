"use client"

import { updateBlock } from "@/app/dashboard/shops/[id]/actions"
import type { BlockType } from "@/database/schema"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react"
import { setProperty } from "dot-prop"
import { useSearchParams } from "next/navigation"

interface BlockEditContextType<T = Record<string, unknown>> {
  handleEdit: (
    fieldPath: string,
    value: string | number | boolean | object | Array<unknown>
  ) => Promise<void>
  isSaving: boolean
  blockId?: string
  content: T
  isEditMode: boolean
  setEditMode: (enabled: boolean) => void
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
  const searchParams = useSearchParams()
  const [isEditMode, setIsEditMode] = useState(false)

  // Initialize edit mode from URL params
  useEffect(() => {
    const editParam = searchParams.get("edit")
    setIsEditMode(editParam === "true")
  }, [searchParams])

  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled)

    // Update URL without navigation
    const newUrl = new URL(window.location.href)
    if (enabled) {
      newUrl.searchParams.set("edit", "true")
    } else {
      newUrl.searchParams.delete("edit")
    }
    window.history.replaceState({}, "", newUrl.toString())
  }

  const handleEdit = async (
    fieldPath: string,
    value: string | number | boolean | object | Array<unknown>
  ) => {
    if (!blockId || !isEditMode) {
      console.warn("No blockId or not in edit mode")
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

  return (
    <BlockEditContext.Provider
      value={{
        handleEdit,
        isSaving,
        blockId,
        content: localContent,
        isEditMode,
        setEditMode
      }}
    >
      {children}
    </BlockEditContext.Provider>
  )
}

export const useBlockEdit = <T = Record<string, unknown>>() => {
  const context = useContext(BlockEditContext)

  if (!context) {
    console.warn("useBlockEdit must be used within a BlockEditProvider")
    return {
      setEditMode: () => null,
      handleEdit: () => null,
      isEditMode: false,
      isSaving: false,
      blockId: undefined,
      content: {} as T
    }
  }

  return context as BlockEditContextType<T>
}
