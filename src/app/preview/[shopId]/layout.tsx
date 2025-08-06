import { PreviewControls } from "./preview-controls"
import { checkShopOwnership } from "@/lib/actions/shop-ownership"

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ shopId: string }>
}) {
  const { shopId } = await params
  const isShopOwner = await checkShopOwnership(shopId)
  console.log({ isShopOwner })
  if (!isShopOwner) {
    return children
  }

  return (
    <>
      <PreviewControls shopId={shopId} />
      {children}
    </>
  )
}
