import { NotFoundPage } from "@/components/ui/not-found-page"

export default function ShopPreviewNotFound() {
  return (
    <NotFoundPage
      title="Shop Not Found"
      description="This shop preview doesn't exist or is not publicly available."
      showCode={false}
    />
  )
}
