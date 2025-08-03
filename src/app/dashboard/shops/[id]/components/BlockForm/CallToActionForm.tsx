"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface CallToActionFormData {
  title: string
  text: string
  buttonText: string
  buttonUrl: string
  variant: "default" | "secondary" | "outline"
}

interface CallToActionFormProps {
  formData: CallToActionFormData
  updateField: (field: string, value: string) => void
  errors: Record<string, string>
}

export function CallToActionForm({
  formData,
  updateField,
  errors
}: CallToActionFormProps) {
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
        <Label htmlFor="text">Text *</Label>
        <Textarea
          id="text"
          value={formData.text || ""}
          onChange={(e) => updateField("text", e.target.value)}
          className={errors.text ? "border-red-500" : ""}
        />
        {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}
      </div>

      <div>
        <Label htmlFor="buttonText">Button Text *</Label>
        <Input
          id="buttonText"
          value={formData.buttonText || ""}
          onChange={(e) => updateField("buttonText", e.target.value)}
          className={errors.buttonText ? "border-red-500" : ""}
        />
        {errors.buttonText && (
          <p className="text-red-500 text-sm">{errors.buttonText}</p>
        )}
      </div>

      <div>
        <Label htmlFor="buttonUrl">Button URL *</Label>
        <Input
          id="buttonUrl"
          value={formData.buttonUrl || ""}
          onChange={(e) => updateField("buttonUrl", e.target.value)}
          className={errors.buttonUrl ? "border-red-500" : ""}
        />
        {errors.buttonUrl && (
          <p className="text-red-500 text-sm">{errors.buttonUrl}</p>
        )}
      </div>

      <div>
        <Label>Button Variant</Label>
        <Select
          value={formData.variant || "default"}
          onValueChange={(value) => updateField("variant", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
