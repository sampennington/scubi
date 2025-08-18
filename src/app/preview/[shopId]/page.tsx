import { PreviewPage } from "@/app/preview/components/preview-page"

export default async function Page({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params

  return <PreviewPage shopId={shopId} />
}
