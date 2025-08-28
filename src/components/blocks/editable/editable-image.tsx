"use client"

import { useState } from "react"
import { Upload, Pencil } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import { useBlockEdit } from "./context"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ImageCropperDialog } from "./image-cropper"
import { Button } from "@/components/ui/button"
import { parseAspectRatio } from "@/lib/image"

interface EditableImageProps {
  fieldPath: string
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  showUploadButton?: boolean
  onError?: () => void
  buttons: "overlay" | "below"
  aspectRatio?: string
}

export const EditableImage = ({
  fieldPath,
  src,
  alt,
  className,
  width,
  height,
  showUploadButton = true,
  buttons = "overlay",
  aspectRatio,
  onError
}: EditableImageProps) => {
  const { handleEdit, blockId } = useBlockEdit()
  const { startUpload, isUploading } = useUploadThing("blockImageUploader")
  const [isCropperOpen, setIsCropperOpen] = useState(false)

  const uploadElementId = `file-input-${blockId}-${fieldPath}`

  const initiateUpload = () => {
    document.getElementById(uploadElementId)?.click()
  }

  const handleFileUpload = async (file: File) => {
    try {
      const uploadRes = await startUpload([file])
      if (!uploadRes?.[0]) {
        throw new Error("Upload failed")
      }

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
        "overflow-hidden object-cover",
        buttons === "overlay" ? "relative" : "flex flex-col items-center p-3",
        className
      )}
    >
      {src ? (
        <NoEditImage src={src} alt={alt} width={width} height={height} onError={onError} />
      ) : (
        <button
          type="button"
          onClick={initiateUpload}
          className={cn(
            "flex h-full w-full items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/20 transition-all duration-200 hover:bg-black/40"
          )}
        >
          <div className="text-center text-muted-foreground">
            <Upload className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">No image</p>
          </div>
        </button>
      )}

      {showUploadButton && (
        <UploadEditButton
          isUploading={isUploading}
          fieldPath={fieldPath}
          onEditClick={() => setIsCropperOpen(true)}
          initiateUpload={initiateUpload}
          buttons={buttons}
        />
      )}

      <input
        id={uploadElementId}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <ImageCropperDialog
        src={src}
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onSave={(croppedImageUrl) => {
          handleEdit(fieldPath, croppedImageUrl)
          setIsCropperOpen(false)
        }}
        aspectRatio={
          aspectRatio ? parseAspectRatio(aspectRatio) : width && height ? width / height : 1
        }
      />
    </div>
  )
}

export const NoEditImage = ({
  src,
  alt,
  width,
  height,
  onError
}: {
  src: string
  alt: string
  width?: number
  height?: number
  onError?: () => void
}) => {
  if (!src) {
    return null
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 400}
      onError={onError}
      className={cn("object-cover transition-all duration-200")}
    />
  )
}

const UploadEditButton = ({
  isUploading,
  onEditClick,
  initiateUpload,
  buttons
}: {
  isUploading: boolean
  fieldPath: string
  onEditClick: () => void
  initiateUpload: () => void
  buttons: "overlay" | "below"
}) => {
  if (buttons === "below") {
    return (
      <div className="mt-4 flex items-center justify-around">
        <Button type="button" variant="secondary" onClick={onEditClick} disabled={isUploading}>
          <Pencil className="mr-4 h-4 w-4" />
          <span className="text-sm">Edit Image</span>
        </Button>

        <Button type="button" variant="outline" onClick={initiateUpload} disabled={isUploading}>
          <Upload className="mr-4 h-4 w-4" />
          <span className="text-sm">New Image</span>
        </Button>
      </div>
    )
  }
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 hover:opacity-100",
        isUploading && "opacity-100"
      )}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="text-sm">Uploading...</span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg bg-white/20 p-3 transition-colors hover:bg-white/30"
            onClick={onEditClick}
            disabled={isUploading}
          >
            <Pencil className="h-4 w-4 text-white" />
            <span className="text-sm text-white">Edit Image</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg bg-white/20 p-3 transition-colors hover:bg-white/30"
            onClick={initiateUpload}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 text-white" />
            <span className="text-sm text-white">New Image</span>
          </button>
        </div>
      )}
    </div>
  )
}
