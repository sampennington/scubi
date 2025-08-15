"use client"

import { useState, useRef } from "react"
import { Cropper } from "react-cropper"
import { X, Check, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import "cropperjs/dist/cropper.css";

interface ImageCropperDialogProps {
  src: string
  isOpen: boolean
  onClose: () => void
  onSave: (croppedImageUrl: string) => void
  aspectRatio?: number
}

export const ImageCropperDialog = ({
  src,
  isOpen,
  onClose,
  onSave,
  aspectRatio = 1
}: ImageCropperDialogProps) => {
  const cropperRef = useRef<any>(null)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCropperLoading, setIsCropperLoading] = useState(true)
  if (!isOpen) return null

  const handleRotate = (direction: "left" | "right") => {
    if (cropperRef.current?.cropper) {
      const newRotation = direction === "left" ? rotation - 90 : rotation + 90
      setRotation(newRotation)
      cropperRef.current.cropper.rotate(direction === "left" ? -90 : 90)
    }
  }

  const handleZoom = (direction: "in" | "out") => {
    if (cropperRef.current?.cropper) {
      const newZoom = direction === "in" ? zoom * 1.1 : zoom / 1.1
      setZoom(newZoom)
      cropperRef.current.cropper.zoom(direction === "in" ? 0.1 : -0.1)
    }
  }

  const handleReset = () => {
    if (cropperRef.current?.cropper) {
      setRotation(0)
      setZoom(1)
      cropperRef.current.cropper.reset()
    }
  }

  const handleSave = async () => {
    if (!cropperRef.current?.cropper) return

    setIsProcessing(true)
    try {
      const canvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 800,
        height: 800 / aspectRatio,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high"
      })

      if (canvas) {
        const croppedImageUrl = canvas.toDataURL("image/jpeg", 0.9)
        onSave(croppedImageUrl)
        onClose()
      } else {
        console.error("Failed to get cropped canvas")
      }
    } catch (error) {
      console.error("Error cropping image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Edit Image</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <div className="max-h-[60vh] max-w-[80vw] overflow-hidden">
            {src ? (
              <Cropper
                ref={cropperRef}
                src={src}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={1}
                aspectRatio={aspectRatio}
                guides={true}
                center={true}
                viewMode={1}
                autoCropArea={0.8}
                background={false}
                responsive={true}
                ready={() => {
                  setIsCropperLoading(false)
                }}
                onError={(error) => {
                  console.error("Cropper error:", error)
                  setIsCropperLoading(false)
                }}
              />
            ) : (
              <div className="flex h-[400px] w-full items-center justify-center bg-gray-100">
                <p className="text-gray-500">No image source provided</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCropperLoading && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  Initializing...
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotate("left")}
                disabled={!cropperRef.current?.cropper || isCropperLoading}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotate("right")}
                disabled={!cropperRef.current?.cropper || isCropperLoading}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom("out")}
                disabled={!cropperRef.current?.cropper || isCropperLoading}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom("in")}
                disabled={!cropperRef.current?.cropper || isCropperLoading}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!cropperRef.current?.cropper || isCropperLoading}
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="primary"
                disabled={!cropperRef.current?.cropper || isProcessing || isCropperLoading}
                className="min-w-[80px]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Save
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
