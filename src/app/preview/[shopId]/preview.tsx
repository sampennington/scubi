"use client"

import { useState, useEffect } from "react"
import type { Block, Page, NavigationItem } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/types"
import { DiveShopSite } from "@/templates/default"
import { EditModePreview } from "./components/EditModePreview"
import { useSearchParams } from "next/navigation"

export default function Preview({
  page,
  pages,
  blocks: initialBlocks,
  siteSettings
}: {
  page: Page
  pages: NavigationItem[]
  blocks: Block[]
  siteSettings: SiteSettings
}) {
  const searchParams = useSearchParams()
  const editMode = searchParams.get("edit") === "true"
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  // Update blocks when initialBlocks change (e.g., from server)
  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  if (editMode) {
    return (
      <EditModePreview
        blocks={blocks}
        pageId={page.id}
        shopId={page.shopId}
        onBlocksChange={setBlocks}
      />
    )
  }

  return (
    <DiveShopSite
      currentPage={page}
      pages={pages}
      siteSettings={siteSettings}
      blocks={blocks}
    />
  )
}
