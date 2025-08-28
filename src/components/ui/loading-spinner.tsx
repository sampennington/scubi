interface LoadingSpinnerProps {
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({
  message = "Loading...",
  className = "",
  size = "md"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  return (
    <div className={`flex min-h-screen items-center justify-center ${className}`}>
      <div className="text-center">
        <div
          className={`${sizeClasses[size]} mx-auto mb-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
        />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  )
}
