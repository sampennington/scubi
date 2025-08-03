"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TwoColumnFormData {
  title: string
  leftContent: string
  rightContent: string
  leftImage?: string
  rightImage?: string
}

interface TwoColumnFormProps {
  formData: TwoColumnFormData
  updateField: (field: string, value: string) => void
  errors: Record<string, string>
}

export function TwoColumnForm({
  formData,
  updateField,
  errors
}: TwoColumnFormProps) {
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leftContent">Left Column Content *</Label>
          <Textarea
            id="leftContent"
            value={formData.leftContent || ""}
            onChange={(e) => updateField("leftContent", e.target.value)}
            className={errors.leftContent ? "border-red-500" : ""}
          />
          {errors.leftContent && (
            <p className="text-red-500 text-sm">{errors.leftContent}</p>
          )}
        </div>

        <div>
          <Label htmlFor="rightContent">Right Column Content *</Label>
          <Textarea
            id="rightContent"
            value={formData.rightContent || ""}
            onChange={(e) => updateField("rightContent", e.target.value)}
            className={errors.rightContent ? "border-red-500" : ""}
          />
          {errors.rightContent && (
            <p className="text-red-500 text-sm">{errors.rightContent}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leftImage">Left Column Image URL (optional)</Label>
          <Input
            id="leftImage"
            value={formData.leftImage || ""}
            onChange={(e) => updateField("leftImage", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="rightImage">Right Column Image URL (optional)</Label>
          <Input
            id="rightImage"
            value={formData.rightImage || ""}
            onChange={(e) => updateField("rightImage", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
