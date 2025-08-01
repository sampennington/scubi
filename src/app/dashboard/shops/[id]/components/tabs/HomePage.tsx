"use client"
import { Form, FormInput } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { createPage, updatePage } from "../../actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Page } from "@/lib/api"

export const HomePage = ({
  shopId,
  homePage
}: {
  shopId: string
  homePage: Page | null
}) => {
  const form = useForm()

  const create = async (data: Partial<Page>) => {
    const res = await createPage(shopId, data)

    if (res.success) {
      toast.success("Home page updated")
    } else {
      toast.error(res.error)
    }
  }

  if (!homePage) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(create)}>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Create your home page.
            </p>
            <Fields />
          </div>

          <Button type="submit">Create</Button>
        </form>
      </Form>
    )
  }

  const update = async (data: Partial<Page>) => {
    const res = await updatePage(homePage.id, data)

    if (res.success) {
      toast.success("Home page updated")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(update)}>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">Edit your home page.</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2" />
          </div>
        </div>
        <Fields homePage={homePage} />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}

const Fields = ({ homePage }: { homePage?: Page }) => {
  return (
    <>
      <FormInput
        name="title"
        label="Title"
        placeholder="Enter your home page title"
        value={homePage?.title}
      />
      <FormInput
        name="slug"
        label="Slug"
        placeholder="Enter your home page slug"
        value={homePage?.slug}
      />
      <FormInput
        name="metaTitle"
        label="Meta Title"
        placeholder="Enter your home page meta title"
        value={homePage?.metaTitle || ""}
      />
      <FormInput
        name="metaDescription"
        label="Meta Description"
        placeholder="Enter your home page meta description"
        value={homePage?.metaDescription || ""}
      />
    </>
  )
}
