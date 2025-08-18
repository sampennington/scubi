import { PageHeader } from "@/components/layout/page-header"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { GeneralSettings } from "./components/GeneralSettings"
import { PreviewButton } from "../../components/PreviewButton"

export default async function ShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const shop = await api.shops.getById(id)
  const siteSettings = await api.siteSettings.getByShopId(id)

  if (!shop) {
    return notFound()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader title={shop.name} description="Manage your shop" />
        <PreviewButton shopId={shop.id} />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-medium text-lg">Shop Details</h2>
        General Settings
        <GeneralSettings shopId={id} siteSettings={siteSettings} />
      </div>
    </>
  )
}
