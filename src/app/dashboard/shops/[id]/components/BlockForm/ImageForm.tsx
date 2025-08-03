"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageFormData {
  src: string
  alt: string
  caption?: string
}

interface ImageFormProps {
  formData: ImageFormData
  updateField: (field: string, value: any) => void
  errors: Record<string, string>
}

export function ImageForm({ formData, updateField, errors }: ImageFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="src">Image URL *</Label>
        <Input
          id="src"
          value={formData.src || ""}
          onChange={(e) => updateField("src", e.target.value)}
          className={errors.src ? "border-red-500" : ""}
        />
        {errors.src && <p className="text-red-500 text-sm">{errors.src}</p>}
      </div>

      <div>
        <Label htmlFor="alt">Alt Text *</Label>
        <Input
          id="alt"
          value={formData.alt || ""}
          onChange={(e) => updateField("alt", e.target.value)}
          className={errors.alt ? "border-red-500" : ""}
        />
        {errors.alt && <p className="text-red-500 text-sm">{errors.alt}</p>}
      </div>

      <div>
        <Label htmlFor="caption">Caption</Label>
        <Input
          id="caption"
          value={formData.caption || ""}
          onChange={(e) => updateField("caption", e.target.value)}
        />
      </div>
    </div>
  )
}
