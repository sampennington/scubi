"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

import { useRouter } from "next/navigation"

export default function Layout({
  children
}: {
  children: React.ReactNode
  params: { shopId: string }
}) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <>
      <Button
        className="absolute top-10 left-10 z-51 flex items-center gap-2"
        onClick={handleBack}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Close Preview
      </Button>
      {children}
    </>
  )
}
