import type { Block, Page } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/types"
import { DiveShopSite } from "@/templates/default"

export default function Preview({
  page,
  pages,
  blocks,
  siteSettings
}: {
  page: Page
  pages: Page[]
  blocks: Block[]
  siteSettings: SiteSettings
}) {
  return (
    <DiveShopSite
      currentPage={page}
      pages={pages}
      siteSettings={siteSettings}
    />
  )
}
