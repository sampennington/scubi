"use client"

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react"

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

  const registerEditor = (id: string, onBlur: () => void) => {
    editorsRef.current.set(id, onBlur)
  }

  const unregisterEditor = (id: string) => {
    editorsRef.current.delete(id)
  }

  const handleSetActiveEditId = (id: string | null) => {
    // If switching to a different editor, blur the current one
    if (activeEditId && activeEditId !== id) {
      const currentEditor = editorsRef.current.get(activeEditId)
      if (currentEditor) {
        currentEditor()
      }
    }
    setActiveEditId(id)
  }

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

    document.addEventListener('mousedown', handleGlobalClick, true)
    return () => document.removeEventListener('mousedown', handleGlobalClick, true)
  }, [activeEditId])

  return (
    <EditStateContext.Provider value={{
      activeEditId,
      setActiveEditId: handleSetActiveEditId,
      registerEditor,
      unregisterEditor
    }}>
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