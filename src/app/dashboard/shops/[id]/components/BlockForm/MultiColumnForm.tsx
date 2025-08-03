"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface ColumnData {
  title: string
  content: string
  image?: string
}

interface MultiColumnFormData {
  title: string
  columns: ColumnData[]
}

interface MultiColumnFormProps {
  formData: MultiColumnFormData
  updateField: (field: string, value: any) => void
  updateArrayField: (field: string, index: number, value: any) => void
  addArrayItem: (field: string, item: any) => void
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
          <Label>Columns *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("columns", {
                title: "",
                content: "",
                image: ""
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>

        {formData.columns?.map((column, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
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
              <Label>Title *</Label>
              <Input
                value={column.title || ""}
                onChange={(e) =>
                  updateArrayField("columns", index, {
                    ...column,
                    title: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Content *</Label>
              <Textarea
                value={column.content || ""}
                onChange={(e) =>
                  updateArrayField("columns", index, {
                    ...column,
                    content: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Image URL (optional)</Label>
              <Input
                value={column.image || ""}
                onChange={(e) =>
                  updateArrayField("columns", index, {
                    ...column,
                    image: e.target.value
                  })
                }
              />
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
