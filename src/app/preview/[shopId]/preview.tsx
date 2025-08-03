import type { Block, Page, NavigationItem } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/types"
import { DiveShopSite } from "@/templates/default"

export default function Preview({
  page,
  pages,
  blocks,
  siteSettings
}: {
  page: Page
  pages: NavigationItem[]
  blocks: Block[]
  siteSettings: SiteSettings
}) {
  return (
    <DiveShopSite
      currentPage={page}
      pages={pages}
      siteSettings={siteSettings}
      blocks={blocks}
    />
  )
}
