"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { BlockImageUpload } from "@/components/ui/block-image-upload"
import type { TeamContent } from "./schemas"

interface TeamFormProps {
  formData: TeamContent
  updateField: (field: string, value: string) => void
  updateArrayField: (
    field: string,
    index: number,
    value: TeamContent["members"][number]
  ) => void
  addArrayItem: (field: string, item: TeamContent["members"][number]) => void
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
                photo: "",
                email: "",
                phone: "",
                socialLinks: {
                  linkedin: "",
                  twitter: "",
                  instagram: ""
                }
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
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

            <BlockImageUpload
              value={member.photo}
              onChange={(url) =>
                updateArrayField("members", index, {
                  ...member,
                  photo: url
                })
              }
              onRemove={() =>
                updateArrayField("members", index, {
                  ...member,
                  photo: ""
                })
              }
              label="Member Photo"
              size="md"
            />

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
              <Label>Phone (optional)</Label>
              <Input
                value={member.phone || ""}
                onChange={(e) =>
                  updateArrayField("members", index, {
                    ...member,
                    phone: e.target.value
                  })
                }
              />
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
