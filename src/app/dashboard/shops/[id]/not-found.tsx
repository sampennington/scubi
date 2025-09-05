import { NotFoundPage } from "@/components/ui/not-found-page"

export default function ShopNotFound() {
  return (
    <NotFoundPage
      title="Shop Not Found"
      description="This shop doesn't exist or you don't have permission to access it."
      buttonLabel="Back to shops"
      buttonHref="/dashboard/shops"
      showCode={false}
      className="bg-gray-50"
    />
  )
}
