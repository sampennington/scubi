import type React from "react"
import { useState } from "react"
import { Settings, X } from "lucide-react"
import { Button } from "../ui/button"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { ShopOwner } from "../ui/shop-ownership-check"
import { useTemplate } from "../template-context"
import { useBlockEdit } from "./block-edit-context"

interface BlockSettingsPanelProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export const BlockSettingsPanel = ({
  children,
  title = "Block Settings",
  className
}: BlockSettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { shopId } = useTemplate()
  const { isEditMode } = useBlockEdit()

  if (!isEditMode) {
    return null
  }

  return (
    <ShopOwner shopId={shopId}>
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-3 right-3 h-10 w-10 p-0 opacity-0 transition-all duration-200 group-hover:opacity-100",
              "border-2 border-border bg-background/90 shadow-lg backdrop-blur-sm hover:scale-110 hover:bg-background",
              "z-50 hover:border-primary/50 hover:shadow-xl",
              className
            )}
          >
            <Settings className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
            <span className="sr-only">Block Settings</span>
          </Button>
        </DialogPrimitive.Trigger>

        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20 data-[state=closed]:animate-out data-[state=open]:animate-in" />
          <DialogPrimitive.Content
            className={cn(
              "fixed top-0 right-0 z-50 h-full w-96 bg-background px-4 shadow-xl transition-all duration-300",
              "data-[state=closed]:animate-out data-[state=open]:animate-in",
              "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
              "border-border border-l",
              "sm:w-[400px]",
              "flex flex-col overflow-y-auto",
              className
            )}
          >
            <DialogPrimitive.Title className="sr-only">
              {title}
            </DialogPrimitive.Title>

            <div className="-mt-4 -mx-4 sticky top-0 mb-6 flex flex-shrink-0 items-center justify-between border-b bg-background px-4 py-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <h2 className="font-semibold text-lg">{title}</h2>
              </div>
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex-1">
              <div className="space-y-6">{children}</div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </ShopOwner>
  )
}

export const SettingsSection = ({
  title,
  children,
  className
}: {
  title: string
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
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
    <div className={cn("space-y-2", className)}>
      <div className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </div>
      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
      {children}
    </div>
  )
}
