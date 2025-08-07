"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, EditIcon, EyeIcon } from "lucide-react"
import { useBlockEdit } from "@/components/editable/block-edit-context"
import { ShopOwner } from "@/components/ui/shop-ownership-check"

export function PreviewControls({ shopId }: { shopId: string }) {
  const router = useRouter()
  const { isEditMode, setEditMode } = useBlockEdit()

  const handleBack = () => {
    router.back()
  }

  return (
    <ShopOwner shopId={shopId}>
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Close Preview
        </Button>

        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={() => setEditMode(!isEditMode)}
          className="flex items-center gap-2"
        >
          {isEditMode ? (
            <>
              <EyeIcon className="h-4 w-4" />
              Preview Mode
            </>
          ) : (
            <>
              <EditIcon className="h-4 w-4" />
              Edit Mode
            </>
          )}
        </Button>
      </div>
    </ShopOwner>
  )
}
