"use client"

import { useCallback, useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { UploadButton } from "./upload-button"

interface BlockImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export const BlockImageUpload = ({
  value,
  onChange,
  onRemove,
  label = "Image",
  size = "md",
  className
}: BlockImageUploadProps) => {
  const { startUpload } = useUploadThing("blockImageUploader")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      setIsUploading(true)
      try {
        const uploadRes = await startUpload([file])
        if (uploadRes?.[0]) {
          onChange(uploadRes[0].ufsUrl)
        }
      } catch (error) {
        console.error("Upload failed:", error)
        alert("Upload failed. Please try again.")
      } finally {
        setIsUploading(false)
      }
    },
    [startUpload, onChange]
  )

  const previewSizes = {
    sm: "h-20 w-20",
    md: "h-32 w-32",
    lg: "h-48 w-48"
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="font-medium text-sm">{label}</Label>

      {value ? (
        <div className="space-y-4">
          <div className="relative group">
            <div
              className={cn(
                "relative overflow-hidden rounded-lg border",
                previewSizes[size]
              )}
            >
              <Image
                src={value}
                alt={label}
                fill
                className="object-cover transition-all duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <UploadButton
                  onFileSelect={handleFileUpload}
                  size="sm"
                  loadingText="Uploading..."
                  uploadText="Replace Image"
                  dragText="or drag and drop"
                  fileTypeText="PNG, JPG, SVG up to 4MB"
                  className="bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>

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
      ) : (
        <div className="space-y-4">
          <UploadButton
            onFileSelect={handleFileUpload}
            size={size}
            loadingText="Uploading image..."
            uploadText="Click to upload"
            dragText="or drag and drop"
            fileTypeText="PNG, JPG, SVG up to 16MB"
          />
        </div>
      )}
    </div>
  )
}
