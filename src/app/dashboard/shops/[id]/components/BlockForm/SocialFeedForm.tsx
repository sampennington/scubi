"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface SocialFeedFormData {
  title: string
  platform: "instagram" | "twitter" | "facebook"
  username: string
  postCount: number
}

interface SocialFeedFormProps {
  formData: SocialFeedFormData
  updateField: (field: string, value: string | number) => void
  errors: Record<string, string>
}

export function SocialFeedForm({
  formData,
  updateField,
  errors
}: SocialFeedFormProps) {
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
        <Label>Platform *</Label>
        <Select
          value={formData.platform || "instagram"}
          onValueChange={(value) => updateField("platform", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          value={formData.username || ""}
          onChange={(e) => updateField("username", e.target.value)}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}
      </div>

      <div>
        <Label htmlFor="postCount">Number of Posts *</Label>
        <Input
          id="postCount"
          type="number"
          min="1"
          max="20"
          value={formData.postCount || "6"}
          onChange={(e) =>
            updateField("postCount", parseInt(e.target.value) || 6)
          }
        />
      </div>
    </div>
  )
}
