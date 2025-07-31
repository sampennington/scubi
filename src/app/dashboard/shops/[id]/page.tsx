import { PageHeader } from "@/components/layout/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { GeneralSettings } from "./components/tabs/GeneralSettings"
import { Contact } from "./components/tabs/Contact"

export default async function ShopPage({ params }: { params: { id: string } }) {
  const id = await params.id
  const shop = await api.shops.getById(id)

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
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="home">Home</TabsContent>
          <TabsContent value="contact">
            <Contact />
          </TabsContent>
          <TabsContent value="about">About</TabsContent>
        </Tabs>
      </div>
    </>
  )
}
