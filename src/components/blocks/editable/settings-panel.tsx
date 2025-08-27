import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import { Settings, X, Trash2, GripVertical, Plus, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "../../ui/button"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { ShopOwner } from "../../ui/shop-ownership-check"
import { useSite } from "../../../app/preview/components/site-context"
import { AddBlockModal } from "../../../app/preview/components/add-block-modal"
import { useBlockEdit } from "./context"
import { deleteBlock as deleteBlockPreview } from "@/app/preview/[shopId]/actions"

interface BlockSettingsPanelProps {
  children: React.ReactNode
  title?: string
  className?: string
  blockId?: string
  order?: number | null
  onBlockAdded?: () => void
  onDeleteBlock?: () => void
  onDragStart?: () => void
}

const SettingsPortal = ({ children }: { children: React.ReactNode }) => {
  const [portalContainer, setPortalContainer] = useState<Element | null>(null)

  useEffect(() => {
    const isInIframe = window !== window.parent

    if (!isInIframe) {
      return
    }

    try {
      const parentDoc = window.parent.document
      let container = parentDoc.getElementById("settings-portal")

      if (!container) {
        container = parentDoc.createElement("div")
        container.id = "settings-portal"
        container.className = "fixed inset-0 z-[9999] pointer-events-none"
        container.style.cssText =
          "position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; pointer-events: none;"
        parentDoc.body.appendChild(container)
      }

      setPortalContainer(container)

      return () => {
        if (container?.parentNode && container.children.length === 0) {
          container.parentNode.removeChild(container)
        }
      }
    } catch (e) {
      console.warn("Could not access parent window, rendering in current frame", e)
    }
  }, [])

  return portalContainer ? (
    createPortal(children, portalContainer)
  ) : (
    <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>
  )
}

export const BlockSettingsPanel = ({
  children,
  title = "Block Settings",
  className,
  onBlockAdded,
  onDeleteBlock,
  onDragStart
}: BlockSettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isEditMode, refreshBlocks } = useSite()
  const { blockId, order } = useBlockEdit()

  const handleBlockAdded = useMemo<() => void>(
    () => onBlockAdded ?? (() => refreshBlocks()),
    [onBlockAdded, refreshBlocks]
  )

  const handleDeleteClick = useMemo<() => void>(() => {
    if (onDeleteBlock) return onDeleteBlock
    return async () => {
      if (!blockId) return
      const ok = window.confirm("Delete this block?")
      if (!ok) return
      await deleteBlockPreview(blockId)
      await refreshBlocks()
    }
  }, [onDeleteBlock, refreshBlocks, blockId])

  if (!isEditMode) {
    return null
  }

  return (
    <ShopOwner>
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "absolute top-4 right-4 z-500 flex items-center gap-1 rounded-lg border bg-background/95 p-1 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100",
            className
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 w-8 p-0 hover:bg-accent"
            title="Add block above"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DialogPrimitive.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent"
              title="Block settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DialogPrimitive.Trigger>

          {onDragStart && (
            <Button
              variant="ghost"
              size="sm"
              onMouseDown={onDragStart}
              className="h-8 w-8 cursor-grab p-0 hover:bg-accent active:cursor-grabbing"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            title="Delete block"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <AddBlockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBlockAdded={handleBlockAdded}
          order={order}
        />

        <SettingsPortal>
          <DialogPrimitive.Overlay className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto fixed inset-0 z-50 bg-black/20 data-[state=closed]:animate-out data-[state=open]:animate-in" />
          <DialogPrimitive.Content
            className={cn(
              "pointer-events-auto fixed top-0 right-0 z-50 h-full w-96 bg-background px-4 shadow-xl transition-all duration-300",
              "data-[state=closed]:animate-out data-[state=open]:animate-in",
              "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
              "border-border border-l",
              "sm:w-[400px]",
              "flex flex-col overflow-y-auto",
              className
            )}
          >
            <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>

            <div className="-mt-4 -mx-4 sticky top-0 mb-6 flex flex-shrink-0 items-center justify-between border-b bg-background px-4 py-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <h2 className="font-semibold text-lg">{title}</h2>
              </div>
              <DialogPrimitive.Close asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex-1">
              <div className="space-y-6 pb-20">{children}</div>
            </div>
          </DialogPrimitive.Content>
        </SettingsPortal>
      </DialogPrimitive.Root>
    </ShopOwner>
  )
}

export const SettingsSection = ({
  title,
  children,
  className,
  collapsible = false,
  defaultOpen = true
}: {
  title: string
  children: React.ReactNode
  className?: string
  collapsible?: boolean
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={cn("rounded-lg border border-blue-200 bg-blue-50", className)}>
      {collapsible ? (
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-black/5"
          )}
          onClick={toggleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              toggleOpen()
            }
          }}
        >
          <h3 className="font-medium text-muted-foreground text-sm tracking-wide">{title}</h3>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      ) : (
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium text-muted-foreground text-sm tracking-wide">{title}</h3>
        </div>
      )}

      {isOpen && <div className="space-y-3 px-4 pb-4">{children}</div>}
    </div>
  )
}

export const SettingItem = ({
  label,
  children,
  description,
  className
}: {
  label: string
  children: React.ReactNode
  description?: string
  className?: string
}) => {
  return (
    <div className={cn("space-y-2 rounded-md border border-white/80 bg-white/50 p-3", className)}>
      <div className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </div>
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
      {children}
    </div>
  )
}
