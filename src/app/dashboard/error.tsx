'use client'

import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function DashboardErrorPage({
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
      title="Dashboard Error"
      description="Something went wrong while loading your dashboard. Please try refreshing the page."
      homeLabel="Go to dashboard"
      homeHref="/dashboard"
      className="bg-gray-50"
    />
  )
}