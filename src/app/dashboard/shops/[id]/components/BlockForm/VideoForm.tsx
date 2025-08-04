"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { VideoContent } from "./schemas"

interface VideoFormProps {
  formData: VideoContent
  updateField: (field: string, value: string) => void
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
          value={formData.videoUrl || ""}
          onChange={(e) => updateField("url", e.target.value)}
          className={errors.url ? "border-red-500" : ""}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
      </div>

      <div>
        <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
        {/* <Input
          id="thumbnail"
          value={formData. || ""}
          onChange={(e) => updateField("thumbnail", e.target.value)}
        /> */}
      </div>
    </div>
  )
}
