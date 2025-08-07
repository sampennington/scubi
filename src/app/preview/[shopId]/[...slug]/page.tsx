import { TemplateWrapper } from "@/components/template-wrapper"

export default async function PreviewPage({
  params
}: {
  params: Promise<{ shopId: string; slug?: string[] }>
}) {
  const { shopId, slug } = await params

  return <TemplateWrapper shopId={shopId} slug={slug} />
}
