"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface MarineLifeData {
  name: string
  description: string
  habitat: string
  image: string
  scientificName?: string
}

interface MarineLifeFormData {
  title: string
  species: MarineLifeData[]
}

interface MarineLifeFormProps {
  formData: MarineLifeFormData
  updateField: (field: string, value: any) => void
  updateArrayField: (field: string, index: number, value: any) => void
  addArrayItem: (field: string, item: any) => void
  removeArrayItem: (field: string, index: number) => void
  errors: Record<string, string>
}

export function MarineLifeForm({
  formData,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  errors
}: MarineLifeFormProps) {
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
        <div className="flex items-center justify-between">
          <Label>Marine Species *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("species", {
                name: "",
                description: "",
                habitat: "",
                image: "",
                scientificName: ""
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Species
          </Button>
        </div>

        {formData.species?.map((species, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Species {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("species", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Name *</Label>
              <Input
                value={species.name || ""}
                onChange={(e) =>
                  updateArrayField("species", index, {
                    ...species,
                    name: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Scientific Name (optional)</Label>
              <Input
                value={species.scientificName || ""}
                onChange={(e) =>
                  updateArrayField("species", index, {
                    ...species,
                    scientificName: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={species.description || ""}
                onChange={(e) =>
                  updateArrayField("species", index, {
                    ...species,
                    description: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Habitat *</Label>
              <Input
                value={species.habitat || ""}
                onChange={(e) =>
                  updateArrayField("species", index, {
                    ...species,
                    habitat: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Image URL *</Label>
              <Input
                value={species.image || ""}
                onChange={(e) =>
                  updateArrayField("species", index, {
                    ...species,
                    image: e.target.value
                  })
                }
              />
            </div>
          </div>
        ))}

        {(!formData.species || formData.species.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No species added yet. Click "Add Species" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
