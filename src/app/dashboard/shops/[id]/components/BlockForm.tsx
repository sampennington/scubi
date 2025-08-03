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
import { ValidationError } from "./BlockForm/ValidationError"
import {
  validateBlockContent,
  isHeroContent,
  isTextContent,
  isImageContent,
  isDividerContent,
  isMultiColumnContent,
  isGalleryContent,
  isTestimonialsContent,
  isTeamContent,
  isFAQContent,
  isContactFormContent,
  isCallToActionContent,
  isVideoContent,
  isMapContent,
  isSocialFeedContent,
  isTwoColumnContent,
  isCoursesContent,
  isMarineLifeContent
} from "./BlockForm/schemas"
import { getRequiredFields } from "./BlockForm/utils"

interface Block {
  id?: string
  type: BlockType
  content: Record<string, unknown>
}

interface BlockFormProps {
  block: Block
  onSave: (blockData: {
    type: BlockType
    content: Record<string, unknown>
  }) => void
  onCancel: () => void
}

export function BlockForm({ block, onSave, onCancel }: BlockFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(
    block.content || {}
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const requiredFields = getRequiredFields(block.type)
    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0) ||
        (typeof formData[field] === "object" &&
          formData[field] !== null &&
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

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const updateArrayField = (field: string, index: number, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as unknown[]).map((item, i) =>
        i === index
          ? {
              ...(item as Record<string, unknown>),
              ...(value as Record<string, unknown>)
            }
          : item
      )
    }))
  }

  const addArrayItem = (field: string, defaultItem: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...((prev[field] as unknown[]) || []), defaultItem]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as unknown[]).filter((_, i) => i !== index)
    }))
  }

  const renderForm = () => {
    const validationResult = validateBlockContent(block.type, formData)

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (error) => `${error.path.join(".")}: ${error.message}`
      )
      return <ValidationError errors={errorMessages} />
    }

    switch (block.type) {
      case BlockType.HERO:
        if (isHeroContent(validationResult.data)) {
          return (
            <HeroForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.TEXT:
        if (isTextContent(validationResult.data)) {
          return (
            <TextForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.IMAGE:
        if (isImageContent(validationResult.data)) {
          return (
            <ImageForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.DIVIDER:
        if (isDividerContent(validationResult.data)) {
          return (
            <DividerForm
              formData={validationResult.data}
              updateField={updateField}
            />
          )
        }
        break
      case BlockType.MULTI_COLUMN:
        if (isMultiColumnContent(validationResult.data)) {
          return (
            <MultiColumnForm
              formData={validationResult.data}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              errors={errors}
            />
          )
        }
        break
      case BlockType.GALLERY:
        if (isGalleryContent(validationResult.data)) {
          return (
            <GalleryForm
              formData={validationResult.data}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              errors={errors}
            />
          )
        }
        break
      case BlockType.TESTIMONIALS:
        if (isTestimonialsContent(validationResult.data)) {
          return (
            <TestimonialsForm
              formData={validationResult.data}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              errors={errors}
            />
          )
        }
        break
      case BlockType.TEAM:
        if (isTeamContent(validationResult.data)) {
          return (
            <TeamForm
              formData={validationResult.data}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              errors={errors}
            />
          )
        }
        break
      case BlockType.FAQ:
        if (isFAQContent(validationResult.data)) {
          return (
            <FAQForm
              formData={validationResult.data}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              errors={errors}
            />
          )
        }
        break
      case BlockType.CONTACT_FORM:
        if (isContactFormContent(validationResult.data)) {
          return (
            <ContactFormForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.CALL_TO_ACTION:
        if (isCallToActionContent(validationResult.data)) {
          return (
            <CallToActionForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.VIDEO:
        if (isVideoContent(validationResult.data)) {
          return (
            <VideoForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.MAP:
        if (isMapContent(validationResult.data)) {
          return (
            <MapForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.SOCIAL_FEED:
        if (isSocialFeedContent(validationResult.data)) {
          return (
            <SocialFeedForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.TWO_COLUMN:
        if (isTwoColumnContent(validationResult.data)) {
          return (
            <TwoColumnForm
              formData={validationResult.data}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.COURSES:
        if (isCoursesContent(validationResult.data)) {
          return (
            <CoursesForm
              formData={validationResult.data}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              errors={errors}
            />
          )
        }
        break
      case BlockType.MARINE_LIFE:
        if (isMarineLifeContent(validationResult.data)) {
          return (
            <MarineLifeForm
              formData={validationResult.data}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              errors={errors}
            />
          )
        }
        break
      default:
        return (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Form for {block.type} block type is not implemented yet.
            </p>
          </div>
        )
    }

    // If we reach here, the type guard failed (shouldn't happen with proper validation)
    return (
      <ValidationError errors={["Unexpected data format"]} title="Type Error" />
    )
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
