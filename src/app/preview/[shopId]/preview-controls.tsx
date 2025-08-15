"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, EditIcon, SaveIcon, SendIcon } from "lucide-react"
import { ShopOwner } from "@/components/ui/shop-ownership-check"
import { useSite } from "@/components/site-context"
import { Switch } from "@/components/ui/switch"

export function PreviewControls({ shopId }: { shopId: string }) {
  const router = useRouter()
  const { isEditMode, setEditMode, publishSite } = useSite()

  const handleBack = () => {
    router.back()
  }

  return (
    <ShopOwner shopId={shopId}>
      <div className="fixed bottom-0 z-500 flex w-full items-center gap-2 rounded-lg border border-border p-3 backdrop-blur-sm">
        <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center gap-2">
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

        <div className="flex items-center gap-2 ml-auto mr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!isEditMode)}
            className="flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            Save Draft
          </Button>

          <Button variant="primary" size="sm" onClick={publishSite} className="flex items-center gap-2">
            <SendIcon className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </ShopOwner>
  )
}
