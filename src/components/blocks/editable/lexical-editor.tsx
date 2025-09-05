"use client"

import { useEffect, useRef, useState } from "react"
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $createTextNode
} from "lexical"
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { MarkNode } from "@lexical/mark"
import { CodeNode } from "@lexical/code"
import { TRANSFORMERS } from "@lexical/markdown"
import { Bold, Italic, Underline } from "lucide-react"
import { Button } from "../../ui/button"
import { cn } from "@/lib/utils"

interface LexicalEditorProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  saveAsHtml?: boolean // Save rich content as HTML instead of plain text
  features?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    links?: boolean
    lists?: boolean
    headings?: boolean
  }
}

// Floating toolbar component
function FloatingToolbar({ features }: { features: LexicalEditorProps["features"] }) {
  const [editor] = useLexicalComposerContext()
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const updateToolbar = () => {
      const selection = $getSelection()

      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        setIsVisible(true)

        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
          const nativeSelection = window.getSelection()
          if (nativeSelection && nativeSelection.rangeCount > 0) {
            const range = nativeSelection.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            setPosition({
              top: rect.top + window.scrollY - 60,
              left: rect.left + window.scrollX + rect.width / 2
            })
          }
        }, 0)
      } else {
        setIsVisible(false)
      }
    }

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(updateToolbar)
    })

    // Also listen for selection changes
    const handleSelectionChange = () => {
      editor.getEditorState().read(updateToolbar)
    }

    document.addEventListener("selectionchange", handleSelectionChange)

    return () => {
      unregister()
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [editor])

  if (!isVisible) return null

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  return (
    <div
      className="fixed z-[9999] flex items-center gap-1 rounded-lg border bg-white p-2 shadow-xl"
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)"
      }}
      data-lexical-editor
    >
      {features?.bold !== false && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText("bold")}
          className="h-8 w-8 p-0"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          <Bold className="h-4 w-4" />
        </Button>
      )}
      {features?.italic !== false && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText("italic")}
          className="h-8 w-8 p-0"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          <Italic className="h-4 w-4" />
        </Button>
      )}
      {features?.underline !== false && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText("underline")}
          className="h-8 w-8 p-0"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          <Underline className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Custom content editable with style preservation
function CustomContentEditable({
  className,
  style
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <ContentEditable
      className={cn(
        "min-h-[1em] w-full resize-none border-0 bg-transparent p-0 outline-none",
        className
      )}
      style={{
        ...style,
        outline: "none",
        border: "none",
        boxShadow: "none"
      }}
    />
  )
}

function InitialContentPlugin({ value, saveAsHtml }: { value: string; saveAsHtml?: boolean }) {
  const [editor] = useLexicalComposerContext()
  const initialValueRef = useRef<string | null>(null)

  useEffect(() => {
    // Only initialize if we haven't set initial content or if this is a completely new editor
    if (
      value &&
      initialValueRef.current !== value &&
      !editor.getEditorState().read(() => $getRoot().getTextContent().trim())
    ) {
      editor.update(() => {
        const root = $getRoot()
        root.clear()

        if (value.trim()) {
          if (saveAsHtml && value.includes("<")) {
            try {
              const parser = new DOMParser()
              const htmlDoc = parser.parseFromString(`<body>${value}</body>`, "text/html")

              const nodes = $generateNodesFromDOM(editor, htmlDoc)
              root.append(...nodes)
            } catch (error) {
              console.error("Failed to parse HTML, falling back to text extraction:", error)
              const tempDiv = document.createElement("div")
              tempDiv.innerHTML = value
              const textContent = tempDiv.textContent || tempDiv.innerText || value

              const paragraph = $createParagraphNode()
              const textNode = $createTextNode(textContent)
              paragraph.append(textNode)
              root.append(paragraph)
            }
          } else {
            const paragraph = $createParagraphNode()
            const textNode = $createTextNode(value)
            paragraph.append(textNode)
            root.append(paragraph)
          }
        }
      })
      initialValueRef.current = value
    }
  }, [editor, value, saveAsHtml])

  return null
}

function ContentChangePlugin({
  onChange,
  saveAsHtml,
  isPlainText
}: {
  onChange: (value: string) => void
  saveAsHtml?: boolean
  isPlainText: boolean
}) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot()

        if (saveAsHtml && !isPlainText) {
          const htmlContent = $generateHtmlFromNodes(editor)
          onChange(htmlContent)
        } else {
          const textContent = root.getTextContent()
          onChange(textContent)
        }
      })
    })
  }, [editor, onChange, saveAsHtml, isPlainText])

  return null
}

function SaveCancelPlugin({
  onSave,
  onCancel,
  isPlainText
}: {
  onSave: () => void
  onCancel: () => void
  isPlainText: boolean
}) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isPlainText) {
        e.preventDefault()
        onSave()
      } else if (e.key === "Escape") {
        e.preventDefault()
        onCancel()
      }
    }

    const handleBlur = () => {
      setTimeout(() => {
        // Check if focus moved to toolbar or other related element
        const activeElement = document.activeElement
        if (!activeElement?.closest("[data-lexical-editor]")) {
          onSave()
        }
      }, 100)
    }

    const editorElement = editor.getRootElement()
    if (editorElement) {
      editorElement.addEventListener("keydown", handleKeyDown)
      editorElement.addEventListener("blur", handleBlur)

      return () => {
        editorElement.removeEventListener("keydown", handleKeyDown)
        editorElement.removeEventListener("blur", handleBlur)
      }
    }
  }, [editor, onSave, onCancel, isPlainText])

  return null
}

export function LexicalEditor({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder = "Enter text...",
  className,
  style,
  saveAsHtml = false,
  features = {}
}: LexicalEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  // Determine if this should be plain text (for headings) or rich text
  const isPlainText =
    features.bold === false && features.italic === false && features.underline === false

  const initialConfig = {
    namespace: "LexicalEditor",
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline"
      },
      heading: {
        h1: "text-4xl font-bold",
        h2: "text-3xl font-semibold",
        h3: "text-2xl font-semibold",
        h4: "text-xl font-semibold",
        h5: "text-lg font-semibold",
        h6: "text-base font-semibold"
      },
      list: {
        nested: {
          listitem: "list-none"
        },
        ol: "list-decimal list-inside",
        ul: "list-disc list-inside",
        listitem: "my-1"
      },
      link: "text-blue-600 underline hover:text-blue-800"
    },
    nodes: isPlainText
      ? []
      : [
          HeadingNode,
          QuoteNode,
          ListNode,
          ListItemNode,
          LinkNode,
          AutoLinkNode,
          MarkNode,
          CodeNode
        ],
    onError: (error: Error) => {
      console.error("Lexical error:", error)
    }
  }

  // We'll handle the change detection in a custom plugin instead

  return (
    <div ref={editorRef} className="relative" data-lexical-editor>
      <LexicalComposer initialConfig={initialConfig}>
        {isPlainText ? (
          <PlainTextPlugin
            contentEditable={<CustomContentEditable className={className} style={style} />}
            placeholder={
              <div className="pointer-events-none absolute text-gray-400">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        ) : (
          <RichTextPlugin
            contentEditable={<CustomContentEditable className={className} style={style} />}
            placeholder={
              <div className="pointer-events-none absolute text-gray-400">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        )}

        <HistoryPlugin />
        <ContentChangePlugin
          onChange={onChange}
          saveAsHtml={saveAsHtml}
          isPlainText={isPlainText}
        />
        <InitialContentPlugin value={value} saveAsHtml={saveAsHtml} />
        <SaveCancelPlugin onSave={onSave} onCancel={onCancel} isPlainText={isPlainText} />

        {!isPlainText && (
          <>
            {features?.links !== false && <LinkPlugin />}
            {features?.lists !== false && <ListPlugin />}
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <FloatingToolbar features={features} />
          </>
        )}
      </LexicalComposer>
    </div>
  )
}
