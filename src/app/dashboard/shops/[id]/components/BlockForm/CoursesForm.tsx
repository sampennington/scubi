"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface CourseData {
  title: string
  description: string
  duration: string
  price: string
  image: string
  instructor: string
}

interface CoursesFormData {
  title: string
  courses: CourseData[]
}

interface CoursesFormProps {
  formData: CoursesFormData
  updateField: (field: string, value: any) => void
  updateArrayField: (field: string, index: number, value: any) => void
  addArrayItem: (field: string, item: any) => void
  removeArrayItem: (field: string, index: number) => void
  errors: Record<string, string>
}

export function CoursesForm({
  formData,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  errors
}: CoursesFormProps) {
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
          <Label>Courses *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("courses", {
                title: "",
                description: "",
                duration: "",
                price: "",
                image: "",
                instructor: ""
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        {formData.courses?.map((course, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Course {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("courses", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Title *</Label>
              <Input
                value={course.title || ""}
                onChange={(e) =>
                  updateArrayField("courses", index, {
                    ...course,
                    title: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={course.description || ""}
                onChange={(e) =>
                  updateArrayField("courses", index, {
                    ...course,
                    description: e.target.value
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration *</Label>
                <Input
                  value={course.duration || ""}
                  onChange={(e) =>
                    updateArrayField("courses", index, {
                      ...course,
                      duration: e.target.value
                    })
                  }
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  value={course.price || ""}
                  onChange={(e) =>
                    updateArrayField("courses", index, {
                      ...course,
                      price: e.target.value
                    })
                  }
                  placeholder="e.g., $99"
                />
              </div>
            </div>

            <div>
              <Label>Instructor *</Label>
              <Input
                value={course.instructor || ""}
                onChange={(e) =>
                  updateArrayField("courses", index, {
                    ...course,
                    instructor: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Image URL *</Label>
              <Input
                value={course.image || ""}
                onChange={(e) =>
                  updateArrayField("courses", index, {
                    ...course,
                    image: e.target.value
                  })
                }
              />
            </div>
          </div>
        ))}

        {(!formData.courses || formData.courses.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No courses added yet. Click "Add Course" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
