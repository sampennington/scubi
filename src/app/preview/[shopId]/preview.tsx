"use client"

import { useState, useEffect } from "react"
import type { Block, Page, NavigationItem } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/types"
import { DiveShopSite } from "@/templates/default"
import { EditModePreview } from "./components/EditModePreview"
import { useBlockEdit } from "@/components/editable/block-edit-context"

export default function Preview({
  page,
  pages,
  blocks: initialBlocks,
  siteSettings,
  isShopOwner
}: {
  page: Page
  pages: NavigationItem[]
  blocks: Block[]
  siteSettings: SiteSettings
  isShopOwner: boolean
}) {
  const { isEditMode } = useBlockEdit()
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  console.log({ isShopOwner, isEditMode })

  if (isShopOwner && isEditMode) {
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
