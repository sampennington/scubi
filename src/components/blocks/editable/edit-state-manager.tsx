"use client"

import { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from "react"

interface EditStateContextValue {
  activeEditId: string | null
  setActiveEditId: (id: string | null) => void
  registerEditor: (id: string, onBlur: () => void) => void
  unregisterEditor: (id: string) => void
}

const EditStateContext = createContext<EditStateContextValue | null>(null)

export function EditStateProvider({ children }: { children: ReactNode }) {
  const [activeEditId, setActiveEditId] = useState<string | null>(null)
  const editorsRef = useRef<Map<string, () => void>>(new Map())

  const registerEditor = useCallback((id: string, onBlur: () => void) => {
    editorsRef.current.set(id, onBlur)
  }, [])

  const unregisterEditor = useCallback((id: string) => {
    editorsRef.current.delete(id)
  }, [])

  const handleSetActiveEditId = useCallback((id: string | null) => {
    // Get the current active ID before updating
    const currentActiveId = activeEditId

    // If switching to a different editor, blur the current one (deferred)
    if (currentActiveId && currentActiveId !== id) {
      const currentEditor = editorsRef.current.get(currentActiveId)
      if (currentEditor) {
        // Defer the blur to avoid updating during render
        setTimeout(() => currentEditor(), 0)
      }
    }

    // Update the active ID
    setActiveEditId(id)
  }, [activeEditId])

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Element

      // Check if click is outside all editors
      let clickedInsideEditor = false
      for (const [editorId] of editorsRef.current) {
        const editorElement = document.querySelector(`[data-editor-id="${editorId}"]`)
        if (editorElement && editorElement.contains(target)) {
          clickedInsideEditor = true
          break
        }
      }

      // If clicked outside all editors, clear active state
      if (!clickedInsideEditor && activeEditId) {
        handleSetActiveEditId(null)
      }
    }

    document.addEventListener("mousedown", handleGlobalClick, true)
    return () => document.removeEventListener("mousedown", handleGlobalClick, true)
  }, [activeEditId, handleSetActiveEditId])

  const contextValue = useMemo(
    () => ({
      activeEditId,
      setActiveEditId: handleSetActiveEditId,
      registerEditor,
      unregisterEditor
    }),
    [activeEditId, handleSetActiveEditId, registerEditor, unregisterEditor]
  )

  return (
    <EditStateContext.Provider value={contextValue}>
      {children}
    </EditStateContext.Provider>
  )
}

export function useEditState() {
  const context = useContext(EditStateContext)
  if (!context) {
    throw new Error("useEditState must be used within EditStateProvider")
  }
  return context
}
