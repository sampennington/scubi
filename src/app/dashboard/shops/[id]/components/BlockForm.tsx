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
import { getDefaultContent, getRequiredFields } from "./BlockForm/utils"
import { defaultMultiColumnContent } from "@/components/blocks/default-data"
import type { Block } from "@/lib/api"

interface BlockFormProps {
  block: Block
  onSave: (blockData: {
    type: BlockType
    content: Record<string, unknown>
  }) => void
  onCancel: () => void
}

export function BlockForm({ block, onSave, onCancel }: BlockFormProps) {
  const defaultState = block.content || getDefaultContent(block.type)

  const [formData, setFormData] = useState<Record<string, unknown>>(
    defaultState as Record<string, unknown>
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
        type: block.type as BlockType,
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
    switch (block.type) {
      case BlockType.HERO:
        if (isHeroContent(formData)) {
          return (
            <HeroForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.TEXT:
        if (isTextContent(formData)) {
          return (
            <TextForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.IMAGE:
        if (isImageContent(formData)) {
          return (
            <ImageForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.DIVIDER:
        if (isDividerContent(formData)) {
          return <DividerForm formData={formData} updateField={updateField} />
        }
        break
      case BlockType.MULTI_COLUMN:
        return (
          <MultiColumnForm
            formData={
              isMultiColumnContent(formData)
                ? formData
                : defaultMultiColumnContent
            }
            updateField={updateField}
            updateArrayField={updateArrayField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            errors={errors}
          />
        )

      case BlockType.GALLERY:
        if (isGalleryContent(formData)) {
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
        }
        break
      case BlockType.TESTIMONIALS:
        if (isTestimonialsContent(formData)) {
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
        }
        break
      case BlockType.TEAM:
        if (isTeamContent(formData)) {
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
        }
        break
      case BlockType.FAQ:
        if (isFAQContent(formData)) {
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
        }
        break
      case BlockType.CONTACT_FORM:
        if (isContactFormContent(formData)) {
          return (
            <ContactFormForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.CALL_TO_ACTION:
        if (isCallToActionContent(formData)) {
          return (
            <CallToActionForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.VIDEO:
        if (isVideoContent(formData)) {
          return (
            <VideoForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.MAP:
        if (isMapContent(formData)) {
          return (
            <MapForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.SOCIAL_FEED:
        if (isSocialFeedContent(formData)) {
          return (
            <SocialFeedForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.TWO_COLUMN:
        if (isTwoColumnContent(formData)) {
          return (
            <TwoColumnForm
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )
        }
        break
      case BlockType.COURSES:
        if (isCoursesContent(formData)) {
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
        }
        break
      case BlockType.MARINE_LIFE:
        if (isMarineLifeContent(formData)) {
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
