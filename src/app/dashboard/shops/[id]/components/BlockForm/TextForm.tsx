"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface TextFormData {
  text: string
  alignment?: "left" | "center" | "right"
}

interface TextFormProps {
  formData: TextFormData
  updateField: (field: string, value: any) => void
  errors: Record<string, string>
}

export function TextForm({ formData, updateField, errors }: TextFormProps) {
  return (
    <div className="space-y-4">
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
        <Label htmlFor="alignment">Alignment</Label>
        <Select
          value={formData.alignment || "left"}
          onValueChange={(value) => updateField("alignment", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
