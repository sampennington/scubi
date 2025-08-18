"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { AddBlockModal } from "./add-block-modal"
import { useSite } from "@/app/preview/components/site-context"

interface AddBlockButtonProps {
  order: number
  onBlockAdded: () => void
}

export function AddBlockButton({ order, onBlockAdded }: AddBlockButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isEditMode } = useSite()

  if (!isEditMode) {
    return null
  }

  return (
    <>
      <div className="group relative py-2">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full bg-border" />
        </div>
        <div className="relative flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-background hover:bg-accent"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </div>
      </div>

      <AddBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBlockAdded={onBlockAdded}
        order={order}
      />
    </>
  )
}
