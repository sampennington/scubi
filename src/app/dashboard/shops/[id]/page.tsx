import { PageHeader } from "@/components/layout/page-header"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function ShopPage({ params }: { params: { id: string } }) {
  const shop = await api.shops.getById(params.id)

  if (!shop) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title={shop.name} description="Manage your shop" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Shop Details</h2>
            <p className="text-sm text-muted-foreground"></p>
          </div>
        </div>
      </div>
    </div>
  )
}
