"use client"

import { useState, useCallback } from "react"

import { Input } from "@/components/ui/input"
import { Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadButtonProps {
  onFileSelect: (file: File) => Promise<void>
  accept?: string
  maxSize?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  loadingText?: string
  uploadText?: string
  dragText?: string
  fileTypeText?: string
  size?: "sm" | "md" | "lg"
}

export const UploadButton = ({
  onFileSelect,
  accept = "image/*",
  disabled = false,
  className,
  children,
  loadingText = "Uploading...",
  uploadText = "Click to upload",
  dragText = "or drag and drop",
  fileTypeText = "PNG, JPG, SVG up to 2MB",
  size = "md"
}: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [inputId] = useState(
    () => `upload-${Math.random().toString(36).substr(2, 9)}`
  )

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true)
      try {
        await onFileSelect(file)
      } catch (error) {
        console.error("Upload failed:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [onFileSelect]
  )

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setDragActive(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        await handleFileUpload(files[0])
      }
    },
    [handleFileUpload]
  )

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  const handleClick = () => {
    document.getElementById(inputId)?.click()
  }

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <button
      type="button"
      className={cn(
        "w-full cursor-pointer rounded-lg border-2 border-dashed bg-transparent text-center transition-colors",
        sizeClasses[size],
        dragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20",
        (isUploading || disabled) && "opacity-50 pointer-events-none",
        className
      )}
      onClick={handleClick}
      onDragOver={(e) => {
        e.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
      disabled={isUploading || disabled}
    >
      <div className="flex flex-col items-center gap-4">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2
              className={cn("animate-spin text-primary", iconSizes[size])}
            />
            <div className={cn("font-medium text-primary", textSizes[size])}>
              {loadingText}
            </div>
          </div>
        ) : (
          <>
            {children || (
              <div className="flex flex-col items-center gap-2">
                <Upload
                  className={cn("text-muted-foreground", iconSizes[size])}
                />
                <div className={textSizes[size]}>
                  <span className="font-medium text-primary">{uploadText}</span>{" "}
                  {dragText}
                </div>
                <div className="text-xs text-muted-foreground">
                  {fileTypeText}
                </div>
              </div>
            )}
            <Input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
              id={inputId}
              disabled={isUploading || disabled}
            />
          </>
        )}
      </div>
    </button>
  )
}
