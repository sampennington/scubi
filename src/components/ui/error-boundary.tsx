"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
  resetLabel?: string
  homeLabel?: string
  homeHref?: string
  className?: string
}

export function ErrorBoundary({
  error,
  reset,
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again or contact support if the problem persists.",
  resetLabel = "Try again",
  homeLabel = "Go home",
  homeHref = "/",
  className = ""
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Error boundary triggered:", error)
  }, [error])

  const handleHomeClick = () => {
    window.location.href = homeHref
  }

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center ${className}`}>
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 font-bold text-2xl text-gray-900">{title}</h1>
        <p className="mb-6 text-gray-600">{description}</p>
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            {resetLabel}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleHomeClick}>
            {homeLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
