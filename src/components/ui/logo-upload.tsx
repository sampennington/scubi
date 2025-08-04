"use client"

import { useCallback } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { UploadButton } from "./upload-button"

interface LogoUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  className?: string
}

export const LogoUpload = ({
  value,
  onChange,
  onRemove,
  className
}: LogoUploadProps) => {
  const { startUpload } = useUploadThing("logoUploader")

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      try {
        const uploadRes = await startUpload([file])
        if (uploadRes?.[0]) {
          onChange(uploadRes[0].ufsUrl)
        }
      } catch (error) {
        console.error("Upload failed:", error)
        alert("Upload failed. Please try again.")
      }
    },
    [startUpload, onChange]
  )

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="font-medium text-sm">Shop Logo</Label>

      {value ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Logo Preview */}
          <div className="flex items-center justify-center rounded-lg border bg-muted/20 p-4">
            <div className="group relative">
              <Image
                src={value}
                alt="Shop logo"
                className="h-16 w-auto object-contain transition-all duration-200 group-hover:scale-105"
                width={100}
                height={100}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="-top-2 -right-2 absolute h-6 w-6 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                onClick={onRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Upload New Logo */}
          <div className="flex flex-col">
            <div className="mb-2 text-muted-foreground text-xs">
              Upload a new logo:
            </div>
            <UploadButton
              onFileSelect={handleFileUpload}
              size="sm"
              loadingText="Uploading new logo..."
              uploadText="Click to upload"
              dragText="or drag and drop"
              fileTypeText="PNG, JPG, SVG up to 2MB"
            />
          </div>
        </div>
      ) : (
        <UploadButton
          onFileSelect={handleFileUpload}
          size="md"
          loadingText="Uploading logo..."
          uploadText="Click to upload"
          dragText="or drag and drop"
          fileTypeText="PNG, JPG, SVG up to 2MB"
        />
      )}
    </div>
  )
}
