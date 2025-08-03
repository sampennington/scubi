"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface MemberData {
  name: string
  role: string
  bio: string
  image: string
  email?: string
  linkedin?: string
}

interface TeamFormData {
  title: string
  members: MemberData[]
}

interface TeamFormProps {
  formData: TeamFormData
  updateField: (field: string, value: any) => void
  updateArrayField: (field: string, index: number, value: any) => void
  addArrayItem: (field: string, item: any) => void
  removeArrayItem: (field: string, index: number) => void
  errors: Record<string, string>
}

export function TeamForm({
  formData,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
  errors
}: TeamFormProps) {
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
          <Label>Team Members *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addArrayItem("members", {
                name: "",
                role: "",
                bio: "",
                image: "",
                email: "",
                linkedin: ""
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {formData.members?.map((member, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Member {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("members", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Name *</Label>
              <Input
                value={member.name || ""}
                onChange={(e) =>
                  updateArrayField("members", index, {
                    ...member,
                    name: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Role *</Label>
              <Input
                value={member.role || ""}
                onChange={(e) =>
                  updateArrayField("members", index, {
                    ...member,
                    role: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Bio *</Label>
              <Textarea
                value={member.bio || ""}
                onChange={(e) =>
                  updateArrayField("members", index, {
                    ...member,
                    bio: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Label>Image URL *</Label>
              <Input
                value={member.image || ""}
                onChange={(e) =>
                  updateArrayField("members", index, {
                    ...member,
                    image: e.target.value
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email (optional)</Label>
                <Input
                  value={member.email || ""}
                  onChange={(e) =>
                    updateArrayField("members", index, {
                      ...member,
                      email: e.target.value
                    })
                  }
                />
              </div>
              <div>
                <Label>LinkedIn (optional)</Label>
                <Input
                  value={member.linkedin || ""}
                  onChange={(e) =>
                    updateArrayField("members", index, {
                      ...member,
                      linkedin: e.target.value
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {(!formData.members || formData.members.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No team members added yet. Click "Add Member" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
