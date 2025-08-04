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
import { BlockImageUpload } from "@/components/ui/block-image-upload"
import type { HeroContent } from "./schemas"

interface HeroFormProps {
  formData: HeroContent
  updateField: (
    field: string,
    value: string | HeroContent["primaryButton"]
  ) => void
  errors: Record<string, string>
}

export function HeroForm({ formData, updateField, errors }: HeroFormProps) {
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

      <BlockImageUpload
        value={formData.image}
        onChange={(url) => updateField("image", url)}
        onRemove={() => updateField("image", "")}
        label="Hero Background Image *"
        size="lg"
        className={errors.image ? "border-red-500" : ""}
      />
      {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Primary Button *</Label>
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={formData.primaryButton?.label || ""}
              onChange={(e) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  label: e.target.value
                })
              }
            />
            <Input
              placeholder="Button URL"
              value={formData.primaryButton?.url || ""}
              onChange={(e) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  url: e.target.value
                })
              }
            />
            <Select
              value={formData.primaryButton?.variant || "secondary"}
              onValueChange={(value) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  variant: value as "secondary" | "outline"
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Secondary Button</Label>
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={formData.secondaryButton?.label || ""}
              onChange={(e) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  label: e.target.value
                })
              }
            />
            <Input
              placeholder="Button URL"
              value={formData.secondaryButton?.url || ""}
              onChange={(e) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  url: e.target.value
                })
              }
            />
            <Select
              value={formData.secondaryButton?.variant || "outline"}
              onValueChange={(value) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  variant: value as "secondary" | "outline"
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
