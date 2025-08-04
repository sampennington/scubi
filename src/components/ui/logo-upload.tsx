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
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="group relative">
              <Image
                src={value}
                alt="Shop logo"
                className="h-16 w-auto rounded-lg border-2 border-muted-foreground/20 object-contain transition-all duration-200 group-hover:border-primary/50"
                width={100}
                height={100}
              />
              <div className="absolute inset-0 rounded-lg bg-black/0 transition-colors duration-200 group-hover:bg-black/5" />
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
            <div className="flex-1">
              <div className="font-medium text-foreground text-sm">
                Logo uploaded successfully
              </div>
              <div className="text-muted-foreground text-xs">
                Click the X to remove or upload a new one below
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2">
              Upload a new logo to replace the current one:
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
          size="lg"
          loadingText="Uploading logo..."
          uploadText="Click to upload"
          dragText="or drag and drop"
          fileTypeText="PNG, JPG, SVG up to 2MB"
        />
      )}
    </div>
  )
}
