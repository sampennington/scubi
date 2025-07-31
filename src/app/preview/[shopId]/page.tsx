import { api } from "@/lib/api"

export default async function PreviewPage({
  params
}: {
  params: { shopId: string }
}) {
  const { shopId } = await params

  const pages = await api.pages.getByShopId(shopId)

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Preview</h1>
        </div>
      </body>
    </html>
  )
}
