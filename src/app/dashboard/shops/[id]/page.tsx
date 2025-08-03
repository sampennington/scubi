import { PageHeader } from "@/components/layout/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { GeneralSettings } from "./components/tabs/GeneralSettings"

import { PreviewButton } from "../../components/PreviewButton"
import { PageEditor } from "./components/PageEditor"

export default async function ShopPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const shop = await api.shops.getById(id)
  const siteSettings = await api.siteSettings.getByShopId(id)

  const allPages = await api.pages.getByShopId(id)
  const topLevelPages = allPages.filter((page) => !page.parentId)

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
        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
            {topLevelPages.map((page) => (
              <TabsTrigger key={page.id} value={page.id}>
                {page.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="settings">
            <GeneralSettings shopId={id} siteSettings={siteSettings} />
          </TabsContent>
          {topLevelPages.map((page) => (
            <TabsContent key={page.id} value={page.id}>
              <PageEditor pageId={page.id} pageTitle={page.title} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
