"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select"
import type { ContactFormContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

const defaultContent: ContactFormContent = {
  title: "Contact Us",
  description: "Get in touch with us",
  fields: [
    { name: "name", type: "text", label: "Name", required: true },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "message", type: "textarea", label: "Message", required: true }
  ]
}

export const ContactFormBlock = ({
  content = defaultContent
}: {
  content?: ContactFormContent
}) => {
  const {
    title,
    description,
    fields,
    submitButtonText = "Send Message",
    successMessage = "Thank you! Your message has been sent successfully.",
    emailTo
  } = content

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Send form data to server
    console.log(`Sending form data to ${emailTo}`)

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({})
    }, 3000)
  }

  if (isSubmitted) {
    return <SuccessMessage successMessage={successMessage} />
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {(title || description) && (
            <div className="mb-12 text-center">
              {title && (
                <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
              )}
              {description && (
                <p className="text-lg text-muted-foreground">{description}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block font-medium text-sm"
                >
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                <Field
                  field={field}
                  handleInputChange={handleInputChange}
                  formData={formData}
                />
              </div>
            ))}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Sending..." : submitButtonText}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

const SuccessMessage = ({ successMessage }: { successMessage: string }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 rounded-lg bg-green-50 p-8 dark:bg-green-900/20">
            <h3 className="mb-4 text-2xl font-semibold text-green-800 dark:text-green-200">
              Success!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              {successMessage}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const Field = ({
  field,
  handleInputChange,
  formData
}: {
  field: ContactFormContent["fields"][0]
  handleInputChange: (name: string, value: string) => void
  formData: Record<string, string>
}) => {
  const { name, type, label, required, placeholder, options } = field

  switch (type) {
    case "textarea":
      return (
        <Textarea
          key={name}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          value={formData[name] || ""}
          onChange={(e) => handleInputChange(name, e.target.value)}
          className="min-h-[120px]"
        />
      )

    case "select":
      return (
        <Select
          key={name}
          value={formData[name] || ""}
          onValueChange={(value) => handleInputChange(name, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    default:
      return (
        <Input
          key={name}
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          value={formData[name] || ""}
          onChange={(e) => handleInputChange(name, e.target.value)}
        />
      )
  }
}
