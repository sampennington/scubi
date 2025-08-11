import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"
import { cn } from "@/lib/utils"

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100",
            "border bg-background/80 shadow-sm backdrop-blur-sm hover:bg-background",
            className
          )}
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Block Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">{children}</div>
      </SheetContent>
    </Sheet>
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
