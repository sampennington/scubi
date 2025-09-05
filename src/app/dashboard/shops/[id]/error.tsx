"use client"

import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function ShopEditErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      title="Shop Error"
      description="We couldn't load this shop for editing. The shop may not exist or you may not have permission."
      homeLabel="Back to shops"
      homeHref="/dashboard/shops"
      className="bg-gray-50"
    />
  )
}
