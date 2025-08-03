import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import Preview from "./preview"

export default async function PreviewPage({
  params
}: {
  params: Promise<{ shopId: string }>
}) {
  const { shopId } = await params

  // Always show home page for root path
  const currentPage = await api.pages.getBySlug(shopId, "/")
  const pages = await api.pages.getNavigationTree(shopId)

  if (!currentPage) {
    return notFound()
  }

  const blocks = await api.blocks.getByPageId(currentPage.id)
  const siteSettings = await api.siteSettings.getByShopId(shopId)

  if (!siteSettings) {
    return <div>No site settings found, please create one</div>
  }

  return (
    <Preview
      page={currentPage}
      pages={pages}
      blocks={blocks}
      siteSettings={siteSettings}
    />
  )
}
