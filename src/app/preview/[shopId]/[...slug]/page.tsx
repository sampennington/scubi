import { api } from "@/lib/api"
import DiveShopSite from "@/templates/default"
import { notFound } from "next/navigation"

export default async function PreviewPage({
  params
}: {
  params: Promise<{ shopId: string; slug?: string[] }>
}) {
  const { shopId, slug } = await params

  // Handle both undefined slug (root path) and empty array
  const currentPath = slug && slug.length > 0 ? `/${slug.join("/")}` : "/"
  const isHome = currentPath === "/"

  const currentPage = await api.pages.getBySlug(
    shopId,
    isHome ? "/" : currentPath
  )
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
    <DiveShopSite
      currentPage={currentPage}
      pages={pages}
      blocks={blocks}
      siteSettings={siteSettings}
    />
  )
}
