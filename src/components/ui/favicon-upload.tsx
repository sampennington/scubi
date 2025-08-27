"use client"

import { useCallback } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { UploadButton } from "./upload-button"

interface FaviconUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  className?: string
}

export const FaviconUpload = ({ value, onChange, onRemove, className }: FaviconUploadProps) => {
  const { startUpload } = useUploadThing("logoUploader") // Reuse logoUploader for favicon

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      // Check file size (favicon should be small)
      if (file.size > 100 * 1024) {
        // 100KB limit
        alert("Favicon must be smaller than 100KB")
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
      <Label className="font-medium text-sm">Favicon</Label>

      {value ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Favicon Preview */}
          <div className="flex items-center justify-center rounded-lg border bg-muted/20 p-4">
            <div className="group relative">
              <Image
                src={value}
                alt="Site favicon"
                className="h-8 w-8 object-contain transition-all duration-200 group-hover:scale-105"
                width={32}
                height={32}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="-top-2 -right-2 absolute h-5 w-5 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                onClick={onRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Upload New Favicon */}
          <div className="flex flex-col">
            <div className="mb-2 text-muted-foreground text-xs">Upload a new favicon:</div>
            <UploadButton
              onFileSelect={handleFileUpload}
              size="sm"
              loadingText="Uploading new favicon..."
              uploadText="Click to upload"
              dragText="or drag and drop"
              fileTypeText="ICO, PNG, SVG up to 100KB"
            />
          </div>
        </div>
      ) : (
        <UploadButton
          onFileSelect={handleFileUpload}
          size="md"
          loadingText="Uploading favicon..."
          uploadText="Click to upload"
          dragText="or drag and drop"
          fileTypeText="ICO, PNG, SVG up to 100KB"
        />
      )}
    </div>
  )
}
