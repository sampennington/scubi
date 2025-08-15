"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, EditIcon, EyeIcon, SaveIcon, SendIcon } from "lucide-react"
import { ShopOwner } from "@/components/ui/shop-ownership-check"
import { useSite } from "@/components/site-context"
import { Switch } from "@/components/ui/switch"

export function PreviewControls({ shopId }: { shopId: string }) {
  const router = useRouter()
  const { isEditMode, setEditMode } = useSite()

  const handleBack = () => {
    router.back()
  }

  return (
    <ShopOwner shopId={shopId}>
      <div className="fixed bottom-0 z-500 w-full flex items-center gap-2  backdrop-blur-sm p-3 rounded-lg border border-border">
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
          <span className="text-sm">Edit Mode</span>

          <Switch
            checked={isEditMode}
            onCheckedChange={() => setEditMode(!isEditMode)}
          />
        </div>


        <div className="flex items-center gap-2 ml-auto mr-4">
          <Button variant="outline" size="sm" onClick={() => setEditMode(!isEditMode)} className="flex items-center gap-2">
            <SaveIcon className="h-4 w-4" />
            Save Draft
          </Button>

          <Button variant="primary" size="sm" onClick={() => setEditMode(!isEditMode)} className="flex items-center gap-2">
            <SendIcon className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </ShopOwner>
  )
}
