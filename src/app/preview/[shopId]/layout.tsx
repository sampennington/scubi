import { BlockEditProvider } from "@/components/ui/block-edit-context"
import { PreviewControls } from "./preview-controls"

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: { shopId: string }
}) {
  const { shopId } = await params
  return (
    <BlockEditProvider
      blockId="preview-controls"
      initialContent={{}}
      type="text"
    >
      <PreviewControls shopId={shopId} />
      {children}
    </BlockEditProvider>
  )
}
