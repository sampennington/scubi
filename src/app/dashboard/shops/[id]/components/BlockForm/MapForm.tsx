"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface MapFormData {
  title: string
  address: string
  description?: string
  latitude?: number
  longitude?: number
}

interface MapFormProps {
  formData: MapFormData
  updateField: (field: string, value: string | number | undefined) => void
  errors: Record<string, string>
}

export function MapForm({ formData, updateField, errors }: MapFormProps) {
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
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address || ""}
          onChange={(e) => updateField("address", e.target.value)}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude (optional)</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude || ""}
            onChange={(e) =>
              updateField(
                "latitude",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude (optional)</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude || ""}
            onChange={(e) =>
              updateField(
                "longitude",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>
      </div>
    </div>
  )
}
