import { SiteWrapper } from "@/components/site-wrapper"

export default async function PreviewPage({
  params
}: {
  params: Promise<{ shopId: string; slug?: string[] }>
}) {
  const { shopId, slug } = await params

  return <SiteWrapper shopId={shopId} slug={slug} />
}
