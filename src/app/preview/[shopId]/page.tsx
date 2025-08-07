import { TemplateWrapper } from "@/components/template-wrapper"

export default async function PreviewPage({
  params
}: {
  params: Promise<{ shopId: string }>
}) {
  const { shopId } = await params

  return <TemplateWrapper shopId={shopId} />
}
