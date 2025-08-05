"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface BlockEditContextType<T = Record<string, unknown>> {
  handleEdit: (fieldPath: string, value: string) => Promise<void>
  isSaving: boolean
  blockId: string
  content: T
}

const BlockEditContext = createContext<BlockEditContextType | null>(null)

interface BlockEditProviderProps<T = Record<string, unknown>> {
  children: ReactNode
  blockId: string
  initialContent: T
  onContentChange?: (content: T) => void
}

export const BlockEditProvider = <T extends Record<string, unknown>>({
  children,
  blockId,
  initialContent,
  onContentChange
}: BlockEditProviderProps<T>) => {
  const [localContent, setLocalContent] = useState<T>(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  // Helper function to set nested values
  const setNestedValue = (obj: T, path: string, value: unknown): T => {
    const keys = path.split(".")
    const newObj = { ...obj } as Record<string, unknown>
    let current = newObj

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = {
        ...(current[keys[i]] as Record<string, unknown>)
      }
    }

    current[keys[keys.length - 1]] = value
    return newObj as T
  }

  const handleEdit = async (fieldPath: string, value: string) => {
    // Optimistic update
    const updatedContent = setNestedValue(localContent, fieldPath, value)
    setLocalContent(updatedContent)

    // Notify parent of content change
    if (onContentChange) {
      onContentChange(updatedContent)
    }

    try {
      setIsSaving(true)
      await fetch(`/api/blocks/${blockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: fieldPath, value })
      })
    } catch (error) {
      // Revert on error
      setLocalContent((prev) =>
        setNestedValue(
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
