import { Button } from "@/components/ui/button"

interface NotFoundPageProps {
  title?: string
  description?: string
  buttonLabel?: string
  buttonHref?: string
  showCode?: boolean
  className?: string
}

export function NotFoundPage({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  buttonLabel = "Go home",
  buttonHref = "/",
  showCode = true,
  className = ""
}: NotFoundPageProps) {
  const handleButtonClick = () => {
    window.location.href = buttonHref
  }

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center ${className}`}>
      <div className="mx-auto max-w-md text-center">
        {showCode && <h1 className="mb-4 font-bold text-6xl text-gray-900">404</h1>}
        <h2 className="mb-4 font-bold text-2xl text-gray-700">{title}</h2>
        <p className="mb-6 text-gray-600">{description}</p>
        <Button onClick={handleButtonClick}>{buttonLabel}</Button>
      </div>
    </div>
  )
}
