"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface TestimonialData {
  name: string
  role: string
  content: string
  image?: string
}

interface TestimonialsFormData {
  title: string
  testimonials: TestimonialData[]
}

interface TestimonialsFormProps {
  formData: TestimonialsFormData
  updateField: (field: string, value: string) => void
  updateArrayField: (
    field: string,
    index: number,
    value: TestimonialData
  ) => void
  addArrayItem: (field: string, item: TestimonialData) => void
  removeArrayItem: (field: string, index: number) => void
  errors: Record<string, string>
}

export function TestimonialsForm({
  formData,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  errors
}: TestimonialsFormProps) {
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
          <Label>Testimonials *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("testimonials", {
                name: "",
                role: "",
                content: "",
                image: ""
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {formData.testimonials?.map((testimonial, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Testimonial {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("testimonials", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Name *</Label>
              <Input
                value={testimonial.name || ""}
                onChange={(e) =>
                  updateArrayField("testimonials", index, {
                    ...testimonial,
                    name: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Role *</Label>
              <Input
                value={testimonial.role || ""}
                onChange={(e) =>
                  updateArrayField("testimonials", index, {
                    ...testimonial,
                    role: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Content *</Label>
              <Textarea
                value={testimonial.content || ""}
                onChange={(e) =>
                  updateArrayField("testimonials", index, {
                    ...testimonial,
                    content: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Image URL (optional)</Label>
              <Input
                value={testimonial.image || ""}
                onChange={(e) =>
                  updateArrayField("testimonials", index, {
                    ...testimonial,
                    image: e.target.value
                  })
                }
              />
            </div>
          </div>
        ))}

        {(!formData.testimonials || formData.testimonials.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No testimonials added yet. Click "Add Testimonial" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
