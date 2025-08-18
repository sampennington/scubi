"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { setProperty } from "dot-prop"
import { updateBlock } from "@/app/dashboard/shops/[id]/actions"
import type { BlockType } from "@/database/schema"
import type { Block } from "@/lib/api"

interface BlockEditContextType<T = Record<string, unknown>> {
  handleEdit: (
    fieldPath: string,
    value: string | number | boolean | object | Array<unknown>
  ) => Promise<void>
  isSaving: boolean
  blockId?: string
  order: number | null
  content: T
}

const BlockEditContext = createContext<BlockEditContextType | null>(null)

type BlockEditProviderProps<T = Record<string, unknown>> = Block & {
  children: ReactNode
  blockId?: string
  content: T
  onContentChange?: (content: T) => void
}

export const BlockEditProvider = <T extends Record<string, unknown>>({
  children,
  content,
  order,
  id,
  onContentChange,
  type
}: BlockEditProviderProps<T>) => {
  const [localContent, setLocalContent] = useState<T>(content)
  const [isSaving, setIsSaving] = useState(false)
  const searchParams = useSearchParams()
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const editParam = searchParams.get("edit")
    setIsEditMode(editParam === "true")
  }, [searchParams])

  const handleEdit = async (
    fieldPath: string,
    value: string | number | boolean | object | Array<unknown>
  ) => {
    if (!id || !isEditMode) {
      console.warn("No blockId or not in edit mode")
      return
    }

    const updatedContent = setProperty(localContent, fieldPath, value)
    setLocalContent(updatedContent)

    if (onContentChange) {
      onContentChange(updatedContent)
    }

    try {
      setIsSaving(true)
      await updateBlock(id, {
        content: updatedContent,
        type: type as BlockType
      })
    } catch (error) {
      setLocalContent((prev) =>
        setProperty(prev, fieldPath, (content as Record<string, unknown>)[fieldPath])
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
        blockId: id,
        order,
        content: localContent
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
      handleEdit: () => null,
      isSaving: false,
      blockId: undefined,
      order: null,
      content: {} as T
    }
  }

  return context as BlockEditContextType<T>
}
