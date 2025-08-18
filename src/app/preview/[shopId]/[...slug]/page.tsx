import { PreviewPage } from "@/app/preview/components/preview-page"

export default async function Page({
  params
}: {
  params: Promise<{ shopId: string; slug?: string[] }>
}) {
  const { shopId, slug } = await params

  return <PreviewPage shopId={shopId} slug={slug} />
}
