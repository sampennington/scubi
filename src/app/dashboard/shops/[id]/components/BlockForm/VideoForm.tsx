"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VideoFormData {
  title: string
  description: string
  url: string
  thumbnail?: string
}

interface VideoFormProps {
  formData: VideoFormData
  updateField: (field: string, value: any) => void
  errors: Record<string, string>
}

export function VideoForm({ formData, updateField, errors }: VideoFormProps) {
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
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div>
        <Label htmlFor="url">Video URL *</Label>
        <Input
          id="url"
          value={formData.url || ""}
          onChange={(e) => updateField("url", e.target.value)}
          className={errors.url ? "border-red-500" : ""}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
      </div>

      <div>
        <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
        <Input
          id="thumbnail"
          value={formData.thumbnail || ""}
          onChange={(e) => updateField("thumbnail", e.target.value)}
        />
      </div>
    </div>
  )
}
