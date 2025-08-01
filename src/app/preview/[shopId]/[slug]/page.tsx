import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import Preview from "./preview"

export default async function PreviewPage({
  params
}: {
  params: { shopId: string; slug: string }
}) {
  const { shopId, slug } = await params

  const isHome = slug === "home"

  const currentPage = await api.pages.getBySlug(shopId, isHome ? "/" : slug)
  const pages = await api.pages.getByShopId(shopId)

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
