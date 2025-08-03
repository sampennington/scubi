"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface FAQItemData {
  question: string
  answer: string
}

interface FAQFormData {
  title: string
  items: FAQItemData[]
}

interface FAQFormProps {
  formData: FAQFormData
  updateField: (field: string, value: string) => void
  updateArrayField: (field: string, index: number, value: FAQItemData) => void
  addArrayItem: (field: string, item: FAQItemData) => void
  removeArrayItem: (field: string, index: number) => void
  errors: Record<string, string>
}

export function FAQForm({
  formData,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  errors
}: FAQFormProps) {
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
          <Label>FAQ Items *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("items", {
                question: "",
                answer: ""
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ Item
          </Button>
        </div>

        {formData.items?.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">FAQ Item {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("items", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Question *</Label>
              <Input
                value={item.question || ""}
                onChange={(e) =>
                  updateArrayField("items", index, {
                    ...item,
                    question: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Answer *</Label>
              <Textarea
                value={item.answer || ""}
                onChange={(e) =>
                  updateArrayField("items", index, {
                    ...item,
                    answer: e.target.value
                  })
                }
              />
            </div>
          </div>
        ))}

        {(!formData.items || formData.items.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No FAQ items added yet. Click "Add FAQ Item" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
