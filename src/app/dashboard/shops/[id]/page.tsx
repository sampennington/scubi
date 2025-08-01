import { PageHeader } from "@/components/layout/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { GeneralSettings } from "./components/tabs/GeneralSettings"
import { Contact } from "./components/tabs/Contact"
import { HomePage } from "./components/tabs/HomePage"

export default async function ShopPage({ params }: { params: { id: string } }) {
  const id = await params.id
  const shop = await api.shops.getById(id)
  const siteSettings = await api.siteSettings.getByShopId(id)

  const pages = await api.pages.getByShopId(id)
  const homePage = pages.find((page) => page.slug === "/")

  if (!shop) {
    return notFound()
  }

  return (
    <>
      <PageHeader title={shop.name} description="Manage your shop" />
      <div className="flex flex-col gap-4">
        <h2 className="font-medium text-lg">Shop Details</h2>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
            <TabsTrigger value="home">Home Page</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <GeneralSettings shopId={id} siteSettings={siteSettings} />
          </TabsContent>
          <TabsContent value="home">
            <HomePage shopId={id} homePage={homePage || null} />
          </TabsContent>
          <TabsContent value="about">About</TabsContent>
          <TabsContent value="contact">
            <Contact />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
