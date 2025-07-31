"use client"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Form, FormInput } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { createShop } from "./actions"
import { redirect } from "next/navigation"
import { toast } from "sonner"

export default function CreateShop() {
  const form = useForm({
    defaultValues: {
      name: "",
      domain: ""
    }
  })

  const handleCreateShop = async (data: { name: string; domain: string }) => {
    const result = await createShop(data)

    if (result.success && result.shop?.id) {
      console.log("Shop created:", result.shop)

      redirect(`/dashboard/shops/${result.shop.id}`)
    } else {
      toast.error(`Failed to create shop: ${result.error}`)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Shop"
        description="Create a new shop to get started."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateShop)}
          className="space-y-4"
        >
          <FormInput
            name="name"
            label="Name"
            placeholder="Enter your dive shops name"
            rules={{ required: "Name is required" }}
          />

          <FormInput
            name="domain"
            label="Domain Name"
            placeholder="If you already have a website, enter the url here."
            rules={{
              pattern: {
                value:
                  /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid domain (e.g., dive-shop.com)"
              }
            }}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
