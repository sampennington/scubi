"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, Edit3Icon, EyeIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: { shopId: string }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [editMode, setEditMode] = useState(searchParams.get("edit") === "true")

  const handleBack = () => {
    router.back()
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
    // Update URL without navigation
    const newUrl = new URL(window.location.href)
    if (!editMode) {
      newUrl.searchParams.set("edit", "true")
    } else {
      newUrl.searchParams.delete("edit")
    }
    window.history.replaceState({}, "", newUrl.toString())
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Close Preview
        </Button>

        <Button
          variant={editMode ? "default" : "outline"}
          size="sm"
          onClick={toggleEditMode}
          className="flex items-center gap-2"
        >
          {editMode ? (
            <>
              <EyeIcon className="h-4 w-4" />
              Preview Mode
            </>
          ) : (
            <>
              <Edit3Icon className="h-4 w-4" />
              Edit Mode
            </>
          )}
        </Button>
      </div>

      {children}
    </>
  )
}
