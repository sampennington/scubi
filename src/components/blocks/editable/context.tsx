"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode
} from "react"
import { useSearchParams } from "next/navigation"
import { setProperty } from "dot-prop"
import { updateBlock } from "@/app/dashboard/shops/[id]/actions"
import type { BlockType } from "@/database/schema"
import type { Block } from "@/lib/api"

interface BlockEditContextType<T = Record<string, unknown>> {
  handleEdit: (
    fieldPath: string,
    value: string | number | boolean | object | Array<unknown>,
    debounce?: boolean
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
  type
}: BlockEditProviderProps<T>) => {
  const [localContent, setLocalContent] = useState<T>(content)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const pendingUpdateRef = useRef<{ content: T; fieldPath: string; value: unknown } | null>(null)

  useEffect(() => {
    const editParam = searchParams.get("edit")
    setIsEditMode(editParam === "true")
  }, [searchParams])

  const debouncedUpdateBlock = useCallback(
    async (content: T) => {
      setIsSaving(true)

      await updateBlock(id, {
        content,
        type: type as BlockType
      })

      if (pendingUpdateRef.current) {
        const { fieldPath } = pendingUpdateRef.current
        setLocalContent((prev) =>
          setProperty(prev, fieldPath, (content as Record<string, unknown>)[fieldPath])
        )
      }

      setIsSaving(false)
      pendingUpdateRef.current = null
    },
    [id, type]
  )

  const handleEdit = async (
    fieldPath: string,
    value: string | number | boolean | object | Array<unknown>,
    debounce: boolean = false
  ) => {
    if (!id || !isEditMode) {
      console.warn("No blockId or not in edit mode")
      return
    }

    const updatedContent = setProperty(localContent, fieldPath, value)
    setLocalContent({ ...updatedContent })

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (debounce) {
      pendingUpdateRef.current = { content: updatedContent, fieldPath, value }
      debounceTimeoutRef.current = setTimeout(() => {
        debouncedUpdateBlock(updatedContent)
      }, 500)
    } else {
      setIsSaving(true)
      await updateBlock(id, {
        content: updatedContent,
        type: type as BlockType
      })
      setIsSaving(false)
    }
  }

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

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
