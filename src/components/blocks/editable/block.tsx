/** biome-ignore-all lint/a11y/noStaticElementInteractions: doing something weird */
"use client"

import { useState, useRef, useEffect, useId, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LexicalEditor } from "./lexical-editor"
import { getFeaturesForElement } from "./editor-presets"
import { useEditState } from "./edit-state-manager"
import { HtmlContent } from "../shared/html-content"

interface EditableBlockProps {
  children: React.ReactNode
  value: string
  onSave: (value: string) => void
  type?: "text" | "textarea" | "lexical"
  className?: string
  placeholder?: string
  multiline?: boolean
  maxLength?: number
  elementType?: string // For determining Lexical features
  useLexical?: boolean // Force Lexical usage
}

export const EditableBlock = ({
  children,
  value,
  onSave,
  type = "text",
  className = "",
  placeholder = "Enter text...",
  multiline = false,
  maxLength,
  elementType,
  useLexical = true
}: EditableBlockProps) => {
  const editorId = useId()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const [computedStyles, setComputedStyles] = useState<React.CSSProperties>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)

  const { activeEditId, setActiveEditId, registerEditor, unregisterEditor } = useEditState()

  // Determine editor type and features
  const shouldUseLexical = useLexical && (multiline || elementType)
  const editorFeatures = elementType ? getFeaturesForElement(elementType) : undefined

  // Check if this editor is active
  const isActive = activeEditId === editorId

  // Update edit value when prop value changes
  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = useCallback(() => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim())
    }
    setIsEditing(false)
  }, [editValue, value, onSave])

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  // Register/unregister with global edit state
  useEffect(() => {
    const handleBlur = () => {
      if (isEditing) {
        if (editValue.trim() !== value) {
          onSave(editValue.trim())
        }
      }
      setIsEditing(false)
      setIsHovered(false)
    }

    registerEditor(editorId, handleBlur)
    return () => unregisterEditor(editorId)
  }, [editorId, registerEditor, unregisterEditor, isEditing, editValue, value, onSave])

  // Update editing state based on global active state
  useEffect(() => {
    if (!isActive && isEditing) {
      handleSave()
      setIsEditing(false)
    }
    if (!isActive) {
      setIsHovered(false)
    }
  }, [isActive, isEditing, handleSave])

  // Extract computed styles from the child element
  useEffect(() => {
    if (childRef.current) {
      const childElement = childRef.current.firstElementChild as HTMLElement
      if (childElement) {
        const styles = window.getComputedStyle(childElement)
        setComputedStyles({
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          lineHeight: styles.lineHeight,
          fontFamily: styles.fontFamily,
          textAlign: styles.textAlign as React.CSSProperties["textAlign"],
          letterSpacing: styles.letterSpacing,
          textTransform: styles.textTransform as React.CSSProperties["textTransform"],
          textDecoration: styles.textDecoration,
          backgroundColor: styles.backgroundColor,
          padding: styles.padding,
          margin: styles.margin,
          border: styles.border,
          borderRadius: styles.borderRadius,
          width: styles.width,
          height: styles.height,
          display: styles.display,
          position: styles.position as React.CSSProperties["position"],
          top: styles.top,
          left: styles.left,
          right: styles.right,
          bottom: styles.bottom,
          zIndex: styles.zIndex,
          overflow: styles.overflow,
          whiteSpace: styles.whiteSpace,
          wordBreak: styles.wordBreak as React.CSSProperties["wordBreak"],
          textOverflow: styles.textOverflow
        })
      }
    }
  }, [])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      if (type === "textarea" && textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.select()
      } else if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  const handleMouseEnter = () => {
    if (isActive || !activeEditId) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isEditing) {
      setIsHovered(false)
    }
  }

  const handleClick = () => {
    setActiveEditId(editorId)
    setIsEditing(true)
    setIsHovered(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    }
  }

  // Show edit interface when hovering or editing
  const showEditInterface = isHovered || isEditing

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          handleClick()
        }
      }}
      data-editor-id={editorId}
      // biome-ignore lint/a11y/useKeyWithClickEvents: a
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a
      tabIndex={0}
    >
      {/* Hidden child element for style extraction */}
      <div
        ref={childRef}
        style={{
          visibility: "hidden",
          position: "absolute",
          pointerEvents: "none",
          zIndex: -1
        }}
      >
        {children}
      </div>

      {/* Original content - hidden when editing */}
      <div
        className={`transition-opacity duration-200 ${className} ${
          isEditing ? "pointer-events-none opacity-0" : "opacity-100"
        } ${isHovered ? "outline-1 outline-purple-500" : ""} outline-offset-2 transition-all duration-200 ease-in-out`}
        style={{
          visibility: isEditing ? "hidden" : "visible"
        }}
      >
        {editorFeatures?.saveAsHtml && typeof value === "string" && value.includes("<") ? (
          <HtmlContent content={value} className={className} />
        ) : (
          children
        )}
      </div>

      {/* Edit interface - shown when hovering or editing */}
      {showEditInterface && (
        <div
          className={`absolute inset-0 z-10 outline-1 outline-purple-500 outline-offset-2 transition-all duration-200 ease-in-out" ${
            isEditing ? "opacity-100" : "opacity-0"
          }`}
          style={{ visibility: showEditInterface ? "visible" : "hidden" }}
        >
          {shouldUseLexical ? (
            <LexicalEditor
              value={editValue}
              onChange={setEditValue}
              onSave={handleSave}
              onCancel={handleCancel}
              placeholder={placeholder}
              style={computedStyles}
              saveAsHtml={editorFeatures?.saveAsHtml}
              features={editorFeatures}
            />
          ) : type === "textarea" ? (
            <Textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              className="resize-none border-0 bg-transparent p-0"
              style={{
                ...computedStyles,
                width: "100%",
                height: "100%",
                outline: "none",
                boxShadow: "none"
              }}
            />
          ) : (
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              className="border-0 bg-transparent p-0"
              style={{
                ...computedStyles,
                width: "100%",
                height: "100%",
                outline: "none",
                boxShadow: "none"
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
