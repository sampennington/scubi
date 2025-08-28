'use client'

import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function ShopPreviewErrorPage({
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
      title="Shop Not Found"
      description="This shop doesn't exist or you don't have permission to view it."
      homeLabel="Back to dashboard"
      homeHref="/dashboard"
    />
  )
}