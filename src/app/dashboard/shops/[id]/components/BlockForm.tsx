"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { BlockType } from "@/database/schema"
import { Plus, Trash2 } from "lucide-react"

interface BlockFormProps {
  block: any
  onSave: (blockData: any) => void
  onCancel: () => void
}

export function BlockForm({ block, onSave, onCancel }: BlockFormProps) {
  const [formData, setFormData] = useState(block.content || {})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getRequiredFields = (blockType: string) => {
    switch (blockType) {
      case BlockType.HERO:
        return ["title", "text", "image", "primaryButton"]
      case BlockType.TEXT:
        return ["text"]
      case BlockType.IMAGE:
        return ["src", "alt"]
      case BlockType.MULTI_COLUMN:
        return ["columns"]
      case BlockType.GALLERY:
        return ["images"]
      case BlockType.TESTIMONIALS:
        return ["testimonials"]
      case BlockType.TEAM:
        return ["members"]
      case BlockType.FAQ:
        return ["items"]
      case BlockType.CONTACT_FORM:
        return ["fields"]
      case BlockType.CALL_TO_ACTION:
        return ["title", "primaryButton"]
      case BlockType.VIDEO:
        return ["videoUrl", "provider"]
      case BlockType.MAP:
        return ["address"]
      case BlockType.SOCIAL_FEED:
        return ["platform", "username"]
      case BlockType.DIVIDER:
        return []
      case BlockType.TWO_COLUMN:
        return ["content"]
      case BlockType.COURSES:
        return ["courses"]
      case BlockType.MARINE_LIFE:
        return ["items"]
      default:
        return []
    }
  }

  const validateForm = () => {
    const requiredFields = getRequiredFields(block.type)
    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0) ||
        (typeof formData[field] === "object" &&
          Object.keys(formData[field]).length === 0)
      ) {
        newErrors[field] = "This field is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        type: block.type,
        content: formData
      })
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: "" }))
    }
  }

  const updateArrayField = (field: string, index: number, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) =>
        i === index ? { ...item, ...value } : item
      )
    }))
  }

  const addArrayItem = (field: string, defaultItem: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultItem]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }))
  }

  const renderHeroForm = () => (
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
        <Label htmlFor="text">Text *</Label>
        <Textarea
          id="text"
          value={formData.text || ""}
          onChange={(e) => updateField("text", e.target.value)}
          className={errors.text ? "border-red-500" : ""}
        />
        {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}
      </div>

      <div>
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          value={formData.image || ""}
          onChange={(e) => updateField("image", e.target.value)}
          className={errors.image ? "border-red-500" : ""}
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Primary Button *</Label>
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={formData.primaryButton?.label || ""}
              onChange={(e) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  label: e.target.value
                })
              }
            />
            <Input
              placeholder="Button URL"
              value={formData.primaryButton?.url || ""}
              onChange={(e) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  url: e.target.value
                })
              }
            />
            <Select
              value={formData.primaryButton?.variant || "secondary"}
              onValueChange={(value) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  variant: value
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Secondary Button</Label>
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={formData.secondaryButton?.label || ""}
              onChange={(e) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  label: e.target.value
                })
              }
            />
            <Input
              placeholder="Button URL"
              value={formData.secondaryButton?.url || ""}
              onChange={(e) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  url: e.target.value
                })
              }
            />
            <Select
              value={formData.secondaryButton?.variant || "outline"}
              onValueChange={(value) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  variant: value
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTextForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Text *</Label>
        <Textarea
          id="text"
          value={formData.text || ""}
          onChange={(e) => updateField("text", e.target.value)}
          className={errors.text ? "border-red-500" : ""}
        />
        {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}
      </div>

      <div>
        <Label htmlFor="alignment">Alignment</Label>
        <Select
          value={formData.alignment || "left"}
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
    </div>
  )

  const renderImageForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="src">Image URL *</Label>
        <Input
          id="src"
          value={formData.src || ""}
          onChange={(e) => updateField("src", e.target.value)}
          className={errors.src ? "border-red-500" : ""}
        />
        {errors.src && <p className="text-red-500 text-sm">{errors.src}</p>}
      </div>

      <div>
        <Label htmlFor="alt">Alt Text *</Label>
        <Input
          id="alt"
          value={formData.alt || ""}
          onChange={(e) => updateField("alt", e.target.value)}
          className={errors.alt ? "border-red-500" : ""}
        />
        {errors.alt && <p className="text-red-500 text-sm">{errors.alt}</p>}
      </div>

      <div>
        <Label htmlFor="caption">Caption</Label>
        <Input
          id="caption"
          value={formData.caption || ""}
          onChange={(e) => updateField("caption", e.target.value)}
        />
      </div>
    </div>
  )

  const renderMultiColumnForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Columns *</Label>
        {errors.columns && (
          <p className="text-red-500 text-sm">{errors.columns}</p>
        )}

        {(formData.columns || []).map((column: any, index: number) => (
          <Card key={index} className="mt-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Column {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("columns", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Icon name (optional)"
                  value={column.icon || ""}
                  onChange={(e) =>
                    updateArrayField("columns", index, { icon: e.target.value })
                  }
                />
                <Input
                  placeholder="Heading"
                  value={column.heading || ""}
                  onChange={(e) =>
                    updateArrayField("columns", index, {
                      heading: e.target.value
                    })
                  }
                />
                <Textarea
                  placeholder="Body text *"
                  value={column.body || ""}
                  onChange={(e) =>
                    updateArrayField("columns", index, { body: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => addArrayItem("columns", { heading: "", body: "" })}
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Columns Per Row</Label>
          <Select
            value={formData.columnsPerRow?.toString() || "3"}
            onValueChange={(value) =>
              updateField("columnsPerRow", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
      </div>
    </div>
  )

  const renderGalleryForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Images *</Label>
        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images}</p>
        )}

        {(formData.images || []).map((image: any, index: number) => (
          <Card key={index} className="mt-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Image {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("images", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Image URL *"
                  value={image.src || ""}
                  onChange={(e) =>
                    updateArrayField("images", index, { src: e.target.value })
                  }
                />
                <Input
                  placeholder="Alt text *"
                  value={image.alt || ""}
                  onChange={(e) =>
                    updateArrayField("images", index, { alt: e.target.value })
                  }
                />
                <Input
                  placeholder="Caption (optional)"
                  value={image.caption || ""}
                  onChange={(e) =>
                    updateArrayField("images", index, {
                      caption: e.target.value
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => addArrayItem("images", { src: "", alt: "" })}
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.layout || "grid"}
            onValueChange={(value) => updateField("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Columns</Label>
          <Select
            value={formData.columns?.toString() || "3"}
            onValueChange={(value) => updateField("columns", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showCaptions"
            checked={formData.showCaptions || false}
            onChange={(e) => updateField("showCaptions", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showCaptions">Show Captions</Label>
        </div>
      </div>
    </div>
  )

  const renderTestimonialsForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Testimonials *</Label>
        {errors.testimonials && (
          <p className="text-red-500 text-sm">{errors.testimonials}</p>
        )}

        {(formData.testimonials || []).map(
          (testimonial: any, index: number) => (
            <Card key={index} className="mt-2">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Testimonial {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem("testimonials", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Name *"
                    value={testimonial.name || ""}
                    onChange={(e) =>
                      updateArrayField("testimonials", index, {
                        name: e.target.value
                      })
                    }
                  />
                  <Input
                    placeholder="Role (optional)"
                    value={testimonial.role || ""}
                    onChange={(e) =>
                      updateArrayField("testimonials", index, {
                        role: e.target.value
                      })
                    }
                  />
                  <Input
                    placeholder="Company (optional)"
                    value={testimonial.company || ""}
                    onChange={(e) =>
                      updateArrayField("testimonials", index, {
                        company: e.target.value
                      })
                    }
                  />
                  <Textarea
                    placeholder="Content *"
                    value={testimonial.content || ""}
                    onChange={(e) =>
                      updateArrayField("testimonials", index, {
                        content: e.target.value
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Rating</Label>
                      <Select
                        value={testimonial.rating?.toString() || "5"}
                        onValueChange={(value) =>
                          updateArrayField("testimonials", index, {
                            rating: parseInt(value)
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Photo URL (optional)</Label>
                      <Input
                        placeholder="Photo URL"
                        value={testimonial.photo || ""}
                        onChange={(e) =>
                          updateArrayField("testimonials", index, {
                            photo: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addArrayItem("testimonials", {
              name: "",
              content: "",
              rating: 5
            })
          }
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.layout || "grid"}
            onValueChange={(value) => updateField("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Columns</Label>
          <Select
            value={formData.columns?.toString() || "3"}
            onValueChange={(value) => updateField("columns", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPhotos"
            checked={formData.showPhotos || false}
            onChange={(e) => updateField("showPhotos", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showPhotos">Show Photos</Label>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showRatings"
          checked={formData.showRatings || false}
          onChange={(e) => updateField("showRatings", e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="showRatings">Show Ratings</Label>
      </div>
    </div>
  )

  const renderTeamForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Team Members *</Label>
        {errors.members && (
          <p className="text-red-500 text-sm">{errors.members}</p>
        )}

        {(formData.members || []).map((member: any, index: number) => (
          <Card key={index} className="mt-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Member {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("members", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Name *"
                  value={member.name || ""}
                  onChange={(e) =>
                    updateArrayField("members", index, { name: e.target.value })
                  }
                />
                <Input
                  placeholder="Role *"
                  value={member.role || ""}
                  onChange={(e) =>
                    updateArrayField("members", index, { role: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Bio *"
                  value={member.bio || ""}
                  onChange={(e) =>
                    updateArrayField("members", index, { bio: e.target.value })
                  }
                />
                <Input
                  placeholder="Photo URL *"
                  value={member.photo || ""}
                  onChange={(e) =>
                    updateArrayField("members", index, {
                      photo: e.target.value
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Email (optional)"
                    value={member.email || ""}
                    onChange={(e) =>
                      updateArrayField("members", index, {
                        email: e.target.value
                      })
                    }
                  />
                  <Input
                    placeholder="Phone (optional)"
                    value={member.phone || ""}
                    onChange={(e) =>
                      updateArrayField("members", index, {
                        phone: e.target.value
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="LinkedIn URL"
                    value={member.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      updateArrayField("members", index, {
                        socialLinks: {
                          ...member.socialLinks,
                          linkedin: e.target.value
                        }
                      })
                    }
                  />
                  <Input
                    placeholder="Twitter URL"
                    value={member.socialLinks?.twitter || ""}
                    onChange={(e) =>
                      updateArrayField("members", index, {
                        socialLinks: {
                          ...member.socialLinks,
                          twitter: e.target.value
                        }
                      })
                    }
                  />
                  <Input
                    placeholder="Instagram URL"
                    value={member.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      updateArrayField("members", index, {
                        socialLinks: {
                          ...member.socialLinks,
                          instagram: e.target.value
                        }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addArrayItem("members", {
              name: "",
              role: "",
              bio: "",
              photo: ""
            })
          }
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.layout || "grid"}
            onValueChange={(value) => updateField("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Columns</Label>
          <Select
            value={formData.columns?.toString() || "3"}
            onValueChange={(value) => updateField("columns", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showContactInfo"
            checked={formData.showContactInfo || false}
            onChange={(e) => updateField("showContactInfo", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showContactInfo">Show Contact Info</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showSocialLinks"
            checked={formData.showSocialLinks || false}
            onChange={(e) => updateField("showSocialLinks", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showSocialLinks">Show Social Links</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fullWidthPhoto"
            checked={formData.fullWidthPhoto || false}
            onChange={(e) => updateField("fullWidthPhoto", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="fullWidthPhoto">Full Width Photos</Label>
        </div>
      </div>
    </div>
  )

  const renderFAQForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>FAQ Items *</Label>
        {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}

        {(formData.items || []).map((item: any, index: number) => (
          <Card key={index} className="mt-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  FAQ Item {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("items", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Question *"
                  value={item.question || ""}
                  onChange={(e) =>
                    updateArrayField("items", index, {
                      question: e.target.value
                    })
                  }
                />
                <Textarea
                  placeholder="Answer *"
                  value={item.answer || ""}
                  onChange={(e) =>
                    updateArrayField("items", index, { answer: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => addArrayItem("items", { question: "", answer: "" })}
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ Item
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.layout || "accordion"}
            onValueChange={(value) => updateField("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accordion">Accordion</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="allowMultipleOpen"
            checked={formData.allowMultipleOpen || false}
            onChange={(e) => updateField("allowMultipleOpen", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="allowMultipleOpen">Allow Multiple Open</Label>
        </div>
      </div>
    </div>
  )

  const renderContactFormForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Form Fields *</Label>
        {errors.fields && (
          <p className="text-red-500 text-sm">{errors.fields}</p>
        )}

        {(formData.fields || []).map((field: any, index: number) => (
          <Card key={index} className="mt-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Field {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("fields", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Field name *"
                  value={field.name || ""}
                  onChange={(e) =>
                    updateArrayField("fields", index, { name: e.target.value })
                  }
                />
                <Input
                  placeholder="Label *"
                  value={field.label || ""}
                  onChange={(e) =>
                    updateArrayField("fields", index, { label: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Field Type</Label>
                    <Select
                      value={field.type || "text"}
                      onValueChange={(value) =>
                        updateArrayField("fields", index, { type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={field.required || false}
                      onChange={(e) =>
                        updateArrayField("fields", index, {
                          required: e.target.checked
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor={`required-${index}`}>Required</Label>
                  </div>
                </div>
                <Input
                  placeholder="Placeholder (optional)"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateArrayField("fields", index, {
                      placeholder: e.target.value
                    })
                  }
                />
                {field.type === "select" && (
                  <Textarea
                    placeholder="Options (one per line)"
                    value={field.options?.join("\n") || ""}
                    onChange={(e) =>
                      updateArrayField("fields", index, {
                        options: e.target.value.split("\n").filter(Boolean)
                      })
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addArrayItem("fields", {
              name: "",
              label: "",
              type: "text",
              required: true
            })
          }
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Submit Button Text</Label>
          <Input
            value={formData.submitButtonText || "Submit"}
            onChange={(e) => updateField("submitButtonText", e.target.value)}
          />
        </div>
        <div>
          <Label>Success Message</Label>
          <Input
            value={formData.successMessage || "Thank you for your message!"}
            onChange={(e) => updateField("successMessage", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Email To</Label>
        <Input
          placeholder="admin@example.com"
          value={formData.emailTo || ""}
          onChange={(e) => updateField("emailTo", e.target.value)}
        />
      </div>
    </div>
  )

  const renderForm = () => {
    switch (block.type) {
      case BlockType.HERO:
        return renderHeroForm()
      case BlockType.TEXT:
        return renderTextForm()
      case BlockType.IMAGE:
        return renderImageForm()
      case BlockType.MULTI_COLUMN:
        return renderMultiColumnForm()
      case BlockType.GALLERY:
        return renderGalleryForm()
      case BlockType.TESTIMONIALS:
        return renderTestimonialsForm()
      case BlockType.TEAM:
        return renderTeamForm()
      case BlockType.FAQ:
        return renderFAQForm()
      case BlockType.CONTACT_FORM:
        return renderContactFormForm()
      case BlockType.CALL_TO_ACTION:
        return renderCallToActionForm()
      case BlockType.VIDEO:
        return renderVideoForm()
      case BlockType.MAP:
        return renderMapForm()
      case BlockType.SOCIAL_FEED:
        return renderSocialFeedForm()
      case BlockType.DIVIDER:
        return renderDividerForm()
      case BlockType.TWO_COLUMN:
        return renderTwoColumnForm()
      case BlockType.COURSES:
        return renderCoursesForm()
      case BlockType.MARINE_LIFE:
        return renderMarineLifeForm()
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Form for {block.type} block type is not implemented yet.
            </p>
          </div>
        )
    }
  }

  const renderCallToActionForm = () => (
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Primary Button *</Label>
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={formData.primaryButton?.label || ""}
              onChange={(e) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  label: e.target.value
                })
              }
            />
            <Input
              placeholder="Button URL"
              value={formData.primaryButton?.url || ""}
              onChange={(e) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  url: e.target.value
                })
              }
            />
            <Select
              value={formData.primaryButton?.variant || "secondary"}
              onValueChange={(value) =>
                updateField("primaryButton", {
                  ...formData.primaryButton,
                  variant: value
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Secondary Button</Label>
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={formData.secondaryButton?.label || ""}
              onChange={(e) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  label: e.target.value
                })
              }
            />
            <Input
              placeholder="Button URL"
              value={formData.secondaryButton?.url || ""}
              onChange={(e) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  url: e.target.value
                })
              }
            />
            <Select
              value={formData.secondaryButton?.variant || "outline"}
              onValueChange={(value) =>
                updateField("secondaryButton", {
                  ...formData.secondaryButton,
                  variant: value
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Background Image URL</Label>
          <Input
            value={formData.backgroundImage || ""}
            onChange={(e) => updateField("backgroundImage", e.target.value)}
          />
        </div>
        <div>
          <Label>Background Color</Label>
          <Input
            value={formData.backgroundColor || ""}
            onChange={(e) => updateField("backgroundColor", e.target.value)}
          />
        </div>
        <div>
          <Label>Text Color</Label>
          <Input
            value={formData.textColor || ""}
            onChange={(e) => updateField("textColor", e.target.value)}
          />
        </div>
      </div>

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
    </div>
  )

  const renderVideoForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="videoUrl">Video URL *</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl || ""}
          onChange={(e) => updateField("videoUrl", e.target.value)}
          className={errors.videoUrl ? "border-red-500" : ""}
        />
        {errors.videoUrl && (
          <p className="text-red-500 text-sm">{errors.videoUrl}</p>
        )}
      </div>

      <div>
        <Label>Provider *</Label>
        <Select
          value={formData.provider || "youtube"}
          onValueChange={(value) => updateField("provider", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Width</Label>
          <Input
            type="number"
            value={formData.width || ""}
            onChange={(e) =>
              updateField("width", parseInt(e.target.value) || undefined)
            }
          />
        </div>
        <div>
          <Label>Height</Label>
          <Input
            type="number"
            value={formData.height || ""}
            onChange={(e) =>
              updateField("height", parseInt(e.target.value) || undefined)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoplay"
            checked={formData.autoplay || false}
            onChange={(e) => updateField("autoplay", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="autoplay">Autoplay</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="controls"
            checked={formData.controls !== false}
            onChange={(e) => updateField("controls", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="controls">Show Controls</Label>
        </div>
      </div>
    </div>
  )

  const renderMapForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            step="any"
            value={formData.latitude || ""}
            onChange={(e) =>
              updateField("latitude", parseFloat(e.target.value) || undefined)
            }
          />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            step="any"
            value={formData.longitude || ""}
            onChange={(e) =>
              updateField("longitude", parseFloat(e.target.value) || undefined)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Zoom Level</Label>
          <Input
            type="number"
            min="1"
            max="20"
            value={formData.zoom || "15"}
            onChange={(e) =>
              updateField("zoom", parseInt(e.target.value) || 15)
            }
          />
        </div>
        <div>
          <Label>Height (px)</Label>
          <Input
            type="number"
            value={formData.height || "400"}
            onChange={(e) =>
              updateField("height", parseInt(e.target.value) || 400)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>API Key</Label>
          <Input
            value={formData.apiKey || ""}
            onChange={(e) => updateField("apiKey", e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showMarker"
            checked={formData.showMarker !== false}
            onChange={(e) => updateField("showMarker", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showMarker">Show Marker</Label>
        </div>
      </div>
    </div>
  )

  const renderSocialFeedForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Platform *</Label>
          <Select
            value={formData.platform || "instagram"}
            onValueChange={(value) => updateField("platform", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Username *</Label>
          <Input
            value={formData.username || ""}
            onChange={(e) => updateField("username", e.target.value)}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Post Count</Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={formData.postCount || "9"}
            onChange={(e) =>
              updateField("postCount", parseInt(e.target.value) || 9)
            }
          />
        </div>
        <div>
          <Label>Columns</Label>
          <Select
            value={formData.columns?.toString() || "3"}
            onValueChange={(value) => updateField("columns", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="6">6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.layout || "grid"}
            onValueChange={(value) => updateField("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showCaptions"
            checked={formData.showCaptions || false}
            onChange={(e) => updateField("showCaptions", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showCaptions">Show Captions</Label>
        </div>
      </div>
    </div>
  )

  const renderDividerForm = () => (
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

  const renderTwoColumnForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Content *</Label>
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Left Column</Label>
            <div className="space-y-2">
              <Select
                value={formData.content?.leftContent?.type || "text"}
                onValueChange={(value) =>
                  updateField("content", {
                    ...formData.content,
                    leftContent: {
                      ...formData.content?.leftContent,
                      type: value
                    }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Title (optional)"
                value={formData.content?.leftContent?.title || ""}
                onChange={(e) =>
                  updateField("content", {
                    ...formData.content,
                    leftContent: {
                      ...formData.content?.leftContent,
                      title: e.target.value
                    }
                  })
                }
              />
              <Textarea
                placeholder="Content"
                value={formData.content?.leftContent?.content || ""}
                onChange={(e) =>
                  updateField("content", {
                    ...formData.content,
                    leftContent: {
                      ...formData.content?.leftContent,
                      content: e.target.value
                    }
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label>Right Column</Label>
            <div className="space-y-2">
              <Select
                value={formData.content?.rightContent?.type || "text"}
                onValueChange={(value) =>
                  updateField("content", {
                    ...formData.content,
                    rightContent: {
                      ...formData.content?.rightContent,
                      type: value
                    }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Title (optional)"
                value={formData.content?.rightContent?.title || ""}
                onChange={(e) =>
                  updateField("content", {
                    ...formData.content,
                    rightContent: {
                      ...formData.content?.rightContent,
                      title: e.target.value
                    }
                  })
                }
              />
              <Textarea
                placeholder="Content"
                value={formData.content?.rightContent?.content || ""}
                onChange={(e) =>
                  updateField("content", {
                    ...formData.content,
                    rightContent: {
                      ...formData.content?.rightContent,
                      content: e.target.value
                    }
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.content?.layout || "text-image"}
            onValueChange={(value) =>
              updateField("content", {
                ...formData.content,
                layout: value
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-image">Text + Image</SelectItem>
              <SelectItem value="image-text">Image + Text</SelectItem>
              <SelectItem value="text-text">Text + Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Alignment</Label>
          <Select
            value={formData.content?.alignment || "top"}
            onValueChange={(value) =>
              updateField("content", {
                ...formData.content,
                alignment: value
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Spacing</Label>
          <Input
            type="number"
            value={formData.content?.spacing || "0"}
            onChange={(e) =>
              updateField("content", {
                ...formData.content,
                spacing: parseInt(e.target.value) || 0
              })
            }
          />
        </div>
      </div>

      <div>
        <Label>Background</Label>
        <Input
          value={formData.background || ""}
          onChange={(e) => updateField("background", e.target.value)}
        />
      </div>

      <div>
        <Label>Padding</Label>
        <Input
          type="number"
          value={formData.padding || "0"}
          onChange={(e) =>
            updateField("padding", parseInt(e.target.value) || 0)
          }
        />
      </div>
    </div>
  )

  const renderCoursesForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Courses *</Label>
        {errors.courses && (
          <p className="text-red-500 text-sm">{errors.courses}</p>
        )}

        {(formData.courses || []).map((course: any, index: number) => (
          <Card key={index} className="mt-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("courses", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Title *"
                  value={course.title || ""}
                  onChange={(e) =>
                    updateArrayField("courses", index, {
                      title: e.target.value
                    })
                  }
                />
                <Textarea
                  placeholder="Description *"
                  value={course.description || ""}
                  onChange={(e) =>
                    updateArrayField("courses", index, {
                      description: e.target.value
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Duration"
                    value={course.duration || ""}
                    onChange={(e) =>
                      updateArrayField("courses", index, {
                        duration: e.target.value
                      })
                    }
                  />
                  <Select
                    value={course.level || "beginner"}
                    onValueChange={(value) =>
                      updateArrayField("courses", index, { level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={course.price || ""}
                    onChange={(e) =>
                      updateArrayField("courses", index, {
                        price: parseFloat(e.target.value) || 0
                      })
                    }
                  />
                  <Input
                    placeholder="Currency"
                    value={course.currency || "USD"}
                    onChange={(e) =>
                      updateArrayField("courses", index, {
                        currency: e.target.value
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Max Depth"
                    value={course.maxDepth || ""}
                    onChange={(e) =>
                      updateArrayField("courses", index, {
                        maxDepth: parseInt(e.target.value) || undefined
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max Students"
                    value={course.maxStudents || ""}
                    onChange={(e) =>
                      updateArrayField("courses", index, {
                        maxStudents: parseInt(e.target.value) || undefined
                      })
                    }
                  />
                </div>
                <Input
                  placeholder="Image URL"
                  value={course.image || ""}
                  onChange={(e) =>
                    updateArrayField("courses", index, {
                      image: e.target.value
                    })
                  }
                />
                <Textarea
                  placeholder="Includes (one per line)"
                  value={course.includes?.join("\n") || ""}
                  onChange={(e) =>
                    updateArrayField("courses", index, {
                      includes: e.target.value.split("\n").filter(Boolean)
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addArrayItem("courses", {
              title: "",
              description: "",
              duration: "",
              level: "beginner",
              price: 0,
              currency: "USD"
            })
          }
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.layout || "grid"}
            onValueChange={(value) => updateField("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Columns</Label>
          <Select
            value={formData.columns?.toString() || "2"}
            onValueChange={(value) => updateField("columns", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPricing"
            checked={formData.showPricing || false}
            onChange={(e) => updateField("showPricing", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="showPricing">Show Pricing</Label>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showLevels"
          checked={formData.showLevels || false}
          onChange={(e) => updateField("showLevels", e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="showLevels">Show Levels</Label>
      </div>
    </div>
  )

  const renderMarineLifeForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Marine Life Items *</Label>
        {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}

        {(formData.items || []).map((item: any, index: number) => (
          <Card key={index} className="mt-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Item {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("items", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Name *"
                  value={item.name || ""}
                  onChange={(e) =>
                    updateArrayField("items", index, { name: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description *"
                  value={item.description || ""}
                  onChange={(e) =>
                    updateArrayField("items", index, {
                      description: e.target.value
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={item.season || "year-round"}
                    onValueChange={(value) =>
                      updateArrayField("items", index, { season: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year-round">Year Round</SelectItem>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="fall">Fall</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={item.difficulty || "easy"}
                    onValueChange={(value) =>
                      updateArrayField("items", index, { difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Depth"
                    value={item.depth || ""}
                    onChange={(e) =>
                      updateArrayField("items", index, {
                        depth: e.target.value
                      })
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    value={item.image || ""}
                    onChange={(e) =>
                      updateArrayField("items", index, {
                        image: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addArrayItem("items", {
              name: "",
              description: "",
              season: "year-round",
              difficulty: "easy"
            })
          }
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Marine Life Item
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Current Season</Label>
          <Select
            value={formData.currentSeason || "summer"}
            onValueChange={(value) => updateField("currentSeason", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="fall">Fall</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Layout</Label>
          <Select
            value={formData.layout || "grid"}
            onValueChange={(value) => updateField("layout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Columns</Label>
          <Select
            value={formData.columns?.toString() || "3"}
            onValueChange={(value) => updateField("columns", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showSeasonalFilter"
            checked={formData.showSeasonalFilter || false}
            onChange={(e) =>
              updateField("showSeasonalFilter", e.target.checked)
            }
            className="rounded"
          />
          <Label htmlFor="showSeasonalFilter">Show Seasonal Filter</Label>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {block.id ? "Edit" : "Add"} {block.type} Block
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {renderForm()}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {block.id ? "Update" : "Add"} Block
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
