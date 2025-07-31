import type { Block, Page } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/site-settings"
import { DiveShopSite } from "@/templates/default"

export default function Preview({
  page,
  blocks,
  siteSettings
}: {
  page: Page
  blocks: Block[]
  siteSettings: SiteSettings
}) {
  return <DiveShopSite currentPage={page.title} siteSettings={siteSettings} />
}
