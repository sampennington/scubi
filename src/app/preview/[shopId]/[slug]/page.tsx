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

  const page = await api.pages.getBySlug(shopId, isHome ? "/" : slug)

  if (!page) {
    return notFound()
  }

  const blocks = await api.blocks.getByPageId(page.id)
  const siteSettings = await api.siteSettings.getByShopId(shopId)

  if (!siteSettings) {
    return <div>No site settings found, please create one</div>
  }

  return <Preview page={page} blocks={blocks} siteSettings={siteSettings} />
}
