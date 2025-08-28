'use client'

import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function PreviewErrorPage({
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
      title="Preview Error"
      description="We couldn't load this shop preview. The shop may not exist or there may be a temporary issue."
      homeLabel="Back to dashboard"
      homeHref="/dashboard"
    />
  )
}