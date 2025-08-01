"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export const PreviewButton = ({ shopId }: { shopId: string }) => {
  const router = useRouter()

  const goToPreview = () => {
    router.push(`/preview/${shopId}/home`)
  }

  return (
    <Button variant="secondary" onClick={goToPreview}>
      <ExternalLink className="mr-2 h-4 w-4" />
      Preview
    </Button>
  )
}
