"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface ColumnData {
  icon?: string
  heading?: string
  body: string
}

interface MultiColumnFormData {
  title?: string
  description?: string
  columns: ColumnData[]
  columnsPerRow?: "1" | "2" | "3" | "4"
  alignment?: "left" | "center" | "right"
  showIcons?: boolean
}

interface MultiColumnFormProps {
  formData: MultiColumnFormData
  updateField: (field: string, value: string) => void
  updateArrayField: (field: string, index: number, value: ColumnData) => void
  addArrayItem: (field: string, item: ColumnData) => void
  removeArrayItem: (field: string, index: number) => void
  errors: Record<string, string>
}

export function MultiColumnForm({
  formData,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  errors
}: MultiColumnFormProps) {
  console.log(formData)
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
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
        <div className="flex items-center justify-between">
          <Label>Columns *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("columns", {
                body: ""
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Column
          </Button>
        </div>

        {formData.columns?.map((column, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Column {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("columns", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Icon (optional)</Label>
              <Input
                value={column.icon || ""}
                onChange={(e) =>
                  updateArrayField("columns", index, {
                    ...column,
                    icon: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Heading (optional)</Label>
              <Input
                value={column.heading || ""}
                onChange={(e) =>
                  updateArrayField("columns", index, {
                    ...column,
                    heading: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Body *</Label>
              <Textarea
                value={column.body || ""}
                onChange={(e) =>
                  updateArrayField("columns", index, {
                    ...column,
                    body: e.target.value
                  })
                }
                className={
                  errors[`columns.${index}.body`] ? "border-red-500" : ""
                }
              />
              {errors[`columns.${index}.body`] && (
                <p className="text-red-500 text-sm">
                  {errors[`columns.${index}.body`]}
                </p>
              )}
            </div>
          </div>
        ))}

        {(!formData.columns || formData.columns.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No columns added yet. Click "Add Column" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
