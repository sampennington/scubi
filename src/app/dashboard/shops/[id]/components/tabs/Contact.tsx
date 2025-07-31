"use client"
import { Button } from "@/components/ui/button"
import { Form, FormInput } from "@/components/ui/form"
import { useForm } from "react-hook-form"

export const Contact = () => {
  const form = useForm()
  return (
    <Form {...form}>
      <h3 className="font-medium text-lg">Contact</h3>
      <p className="text-muted-foreground text-sm">
        Manage your shop's contact information.
      </p>
      <FormInput
        name="whatsapp"
        label="WhatsApp"
        placeholder="Enter your shop facebook"
      />
      <FormInput
        name="facebook"
        label="Facebook"
        placeholder="Enter your shop facebook"
      />
      <FormInput
        name="instagram"
        label="Instagram"
        placeholder="Enter your shop instagram"
      />
      <FormInput
        name="twitter"
        label="Twitter"
        placeholder="Enter your shop twitter"
      />
      <FormInput
        name="linkedin"
        label="LinkedIn"
        placeholder="Enter your shop linkedin"
      />
      <Button type="submit">Save</Button>
    </Form>
  )
}
