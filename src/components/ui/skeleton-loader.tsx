interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
}

interface SkeletonCardProps {
  titleWidth?: string
  lines?: number
  className?: string
}

export function SkeletonCard({
  titleWidth = "w-32",
  lines = 2,
  className = ""
}: SkeletonCardProps) {
  return (
    <div className={`rounded-lg border bg-white p-6 ${className}`}>
      <Skeleton className={`mb-4 h-6 ${titleWidth}`} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
    </div>
  )
}

interface ShopsLoadingGridProps {
  count?: number
  className?: string
}

export function ShopsLoadingGrid({ count = 6, className = "" }: ShopsLoadingGridProps) {
  return (
    <div className={className}>
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

interface ShopEditLoadingProps {
  className?: string
}

export function ShopEditLoading({ className = "" }: ShopEditLoadingProps) {
  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-6">
        <div className="rounded-lg border bg-white p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
