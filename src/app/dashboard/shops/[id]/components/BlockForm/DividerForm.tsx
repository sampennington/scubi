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

interface DividerFormData {
  text?: string
  alignment?: "left" | "center" | "right"
  style?: "solid" | "dashed" | "dotted"
  color?: string
  thickness?: number
}

interface DividerFormProps {
  formData: DividerFormData
  updateField: (field: string, value: any) => void
}

export function DividerForm({ formData, updateField }: DividerFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Text (optional)</Label>
        <Input
          id="text"
          value={formData.text || ""}
          onChange={(e) => updateField("text", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Alignment</Label>
          <Select
            value={formData.alignment || "center"}
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
        <div>
          <Label>Style</Label>
          <Select
            value={formData.style || "solid"}
            onValueChange={(value) => updateField("style", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color</Label>
          <Input
            value={formData.color || ""}
            onChange={(e) => updateField("color", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Thickness (px)</Label>
        <Input
          type="number"
          min="1"
          max="10"
          value={formData.thickness || "1"}
          onChange={(e) =>
            updateField("thickness", parseInt(e.target.value) || 1)
          }
        />
      </div>
    </div>
  )
}
