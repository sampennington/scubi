"use client"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import { useBlockEdit } from "./block-edit-context"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface EditableImageProps {
  fieldPath: string
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fallbackSrc?: string
  showUploadButton?: boolean
  aspectRatio?: "square" | "video" | "auto"
  onError?: () => void
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  auto: ""
}

export const EditableImage = ({
  fieldPath,
  src,
  alt,
  className,
  width = 128,
  height = 128,
  fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' fill='%23f3f4f6'/%3E%3Cpath d='M64 32c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm0 48c-8.837 0-16-7.163-16-16s7.163-16 16-16 16 7.163 16 16-7.163 16-16 16z' fill='%23d1d5db'/%3E%3C/svg%3E",
  showUploadButton = true,
  aspectRatio = "square",
  onError
}: EditableImageProps) => {
  const { handleEdit } = useBlockEdit()
  const { startUpload, isUploading } = useUploadThing("blockImageUploader")
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFileUpload = async (file: File) => {
    try {
      const uploadRes = await startUpload([file])
      if (!uploadRes?.[0]) {
        throw new Error("Upload failed")
      }

      // Update the field with the new image URL
      handleEdit(fieldPath, uploadRes[0].ufsUrl)
    } catch (error) {
      console.error("Failed to upload image:", error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div
      className={cn(
        "group relative",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {src && src !== fallbackSrc ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onError={onError}
          className={cn(
            "h-full w-full object-cover transition-all duration-200",
            aspectRatioClasses[aspectRatio]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/20",
            aspectRatioClasses[aspectRatio]
          )}
        >
          <div className="text-center text-muted-foreground">
            <Upload className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">No image</p>
          </div>
        </div>
      )}

      {showUploadButton && isMounted && (
        <button
          type="button"
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200",
            (isHovered || isUploading) && "opacity-100"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() =>
            document.getElementById(`file-input-${fieldPath}`)?.click()
          }
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Change Photo</span>
            </div>
          )}
        </button>
      )}

      <input
        id={`file-input-${fieldPath}`}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}
