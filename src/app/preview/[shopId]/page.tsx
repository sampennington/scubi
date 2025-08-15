import { SiteWrapper } from "@/components/site-wrapper"

export default async function PreviewPage({
  params
}: {
  params: Promise<{ shopId: string }>
}) {
  const { shopId } = await params

  return <SiteWrapper shopId={shopId} />
}
