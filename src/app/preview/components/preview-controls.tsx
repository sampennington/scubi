"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  SendIcon,
  SmartphoneIcon,
  TabletIcon,
  MonitorIcon,
  PaletteIcon
} from "lucide-react"
import { ShopOwner } from "@/components/ui/shop-ownership-check"
import { useSite } from "@/app/preview/components/site-context"
import { Switch } from "@/components/ui/switch"
import { ThemeEditorModal } from "./theme-editor-modal"
import type { DeviceId } from "@/lib/preview-presets"

export function PreviewControls({ shopId }: { shopId: string }) {
  const router = useRouter()
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const { isEditMode, setEditMode, publishSite, previewDimension, setPreviewDimension } = useSite()

  const handleBack = () => {
    router.back()
  }

  const previewOptions = [
    { id: "mobile" as DeviceId, icon: SmartphoneIcon, label: "Mobile" },
    { id: "tablet" as DeviceId, icon: TabletIcon, label: "Tablet" },
    { id: "desktop" as DeviceId, icon: MonitorIcon, label: "Desktop" }
  ]

  if (typeof window !== "undefined" && window.location.search.includes("device")) {
    return null
  }

  return (
    <ShopOwner shopId={shopId}>
      <div className="fixed bottom-0 z-500 flex w-full items-center gap-2 rounded-lg border border-border p-3 backdrop-blur-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Close Preview
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <EditIcon className="h-4 w-4" />
            Edit Mode
          </div>

          <Switch checked={isEditMode} onCheckedChange={() => setEditMode(!isEditMode)} />
        </div>

        <div className="ml-4 flex items-center gap-1">
          {previewOptions.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={previewDimension === id ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewDimension(id)}
              className="flex items-center gap-2 px-3"
              title={label}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        <div className="mr-4 ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsThemeModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PaletteIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!isEditMode)}
            className="flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            Save Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={publishSite}
            className="flex items-center gap-2"
          >
            <SendIcon className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
      
      <ThemeEditorModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
      />
    </ShopOwner>
  )
}
