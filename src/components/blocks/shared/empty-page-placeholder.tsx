"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { AddBlockModal } from "../../../app/preview/components/add-block-modal"
import { useSite } from "@/app/preview/components/site-context"
import { useState } from "react"

export function EmptyPagePlaceholder() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isEditMode, refreshBlocks } = useSite()

  if (!isEditMode) {
    return null
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-6xl">📄</div>
        <h3 className="mb-2 font-medium text-lg">No content yet</h3>
        <p className="mb-6 text-muted-foreground">
          Start building your page by adding your first block
        </p>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Your First Block
        </Button>
      </div>

      <AddBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBlockAdded={refreshBlocks}
        order={0}
      />
    </>
  )
}
