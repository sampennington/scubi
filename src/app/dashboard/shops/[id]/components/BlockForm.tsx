"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { BlockType } from "@/database/schema"
import {
  DividerForm,
  HeroForm,
  TextForm,
  ImageForm,
  MultiColumnForm,
  GalleryForm,
  TestimonialsForm,
  TeamForm,
  FAQForm,
  ContactFormForm,
  CallToActionForm,
  VideoForm,
  MapForm,
  SocialFeedForm,
  TwoColumnForm,
  CoursesForm,
  MarineLifeForm
} from "./BlockForm/index"

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
        return ["title", "columns"]
      case BlockType.GALLERY:
        return ["title", "images"]
      case BlockType.TESTIMONIALS:
        return ["title", "testimonials"]
      case BlockType.TEAM:
        return ["title", "members"]
      case BlockType.FAQ:
        return ["title", "items"]
      case BlockType.CONTACT_FORM:
        return ["title", "description", "email"]
      case BlockType.CALL_TO_ACTION:
        return ["title", "text", "buttonText", "buttonUrl"]
      case BlockType.VIDEO:
        return ["title", "description", "url"]
      case BlockType.MAP:
        return ["title", "address"]
      case BlockType.SOCIAL_FEED:
        return ["title", "platform", "username"]
      case BlockType.DIVIDER:
        return []
      case BlockType.TWO_COLUMN:
        return ["title", "leftContent", "rightContent"]
      case BlockType.COURSES:
        return ["title", "courses"]
      case BlockType.MARINE_LIFE:
        return ["title", "species"]
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

  const renderForm = () => {
    switch (block.type) {
      case BlockType.HERO:
        return (
          <HeroForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.TEXT:
        return (
          <TextForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.IMAGE:
        return (
          <ImageForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.DIVIDER:
        return <DividerForm formData={formData} updateField={updateField} />
      case BlockType.MULTI_COLUMN:
        return (
          <MultiColumnForm
            formData={formData}
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )
      case BlockType.GALLERY:
        return (
          <GalleryForm
            formData={formData}
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )
      case BlockType.TESTIMONIALS:
        return (
          <TestimonialsForm
            formData={formData}
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )
      case BlockType.TEAM:
        return (
          <TeamForm
            formData={formData}
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )
      case BlockType.FAQ:
        return (
          <FAQForm
            formData={formData}
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )
      case BlockType.CONTACT_FORM:
        return (
          <ContactFormForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.CALL_TO_ACTION:
        return (
          <CallToActionForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.VIDEO:
        return (
          <VideoForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.MAP:
        return (
          <MapForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.SOCIAL_FEED:
        return (
          <SocialFeedForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.TWO_COLUMN:
        return (
          <TwoColumnForm
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )
      case BlockType.COURSES:
        return (
          <CoursesForm
            formData={formData}
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )
      case BlockType.MARINE_LIFE:
        return (
          <MarineLifeForm
            formData={formData}
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )
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
