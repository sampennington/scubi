"use client"
import { Form, FormInput } from "@/components/ui/form"
import { useForm } from "react-hook-form"

export const GeneralSettings = () => {
  const form = useForm()
  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Manage your shop's general settings.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"></div>
        </div>
      </div>

      <FormInput name="name" label="Name" placeholder="Enter your shop name" />
      <FormInput
        name="description"
        label="Description"
        placeholder="Enter your shop description"
      />
      <FormInput
        name="address"
        label="Address"
        placeholder="Enter your shop address"
      />
      <FormInput
        name="phone"
        label="Phone"
        placeholder="Enter your shop phone"
      />
      <FormInput
        name="email"
        label="Email"
        placeholder="Enter your shop email"
      />
      <FormInput
        name="website"
        label="Website"
        placeholder="Enter your shop website"
      />
    </Form>
  )
}
