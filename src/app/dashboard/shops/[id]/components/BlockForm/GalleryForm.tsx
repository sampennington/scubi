"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface ImageData {
  src: string
  alt: string
  caption?: string
}

interface GalleryFormData {
  title: string
  images: ImageData[]
}

interface GalleryFormProps {
  formData: GalleryFormData
  updateField: (field: string, value: string) => void
  updateArrayField: (field: string, index: number, value: ImageData) => void
  addArrayItem: (field: string, item: ImageData) => void
  removeArrayItem: (field: string, index: number) => void
  errors: Record<string, string>
}

export function GalleryForm({
  formData,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  errors
}: GalleryFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Images *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("images", {
                src: "",
                alt: "",
                caption: ""
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>

        {formData.images?.map((image, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Image {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("images", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Image URL *</Label>
              <Input
                value={image.src || ""}
                onChange={(e) =>
                  updateArrayField("images", index, {
                    ...image,
                    src: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Alt Text *</Label>
              <Input
                value={image.alt || ""}
                onChange={(e) =>
                  updateArrayField("images", index, {
                    ...image,
                    alt: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Caption (optional)</Label>
              <Input
                value={image.caption || ""}
                onChange={(e) =>
                  updateArrayField("images", index, {
                    ...image,
                    caption: e.target.value
                  })
                }
              />
            </div>
          </div>
        ))}

        {(!formData.images || formData.images.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No images added yet. Click "Add Image" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
