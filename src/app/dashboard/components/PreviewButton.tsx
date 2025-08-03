"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { getPreviewUrl } from "@/lib/utils"

export const PreviewButton = ({ shopId }: { shopId: string }) => {
  const previewUrl = getPreviewUrl(shopId)

  return (
    <Button variant="secondary" asChild>
      <a href={previewUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="mr-2 h-4 w-4" />
        Preview
      </a>
    </Button>
  )
}
