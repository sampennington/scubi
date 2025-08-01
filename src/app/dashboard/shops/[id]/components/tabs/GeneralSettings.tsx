"use client"
import { Form, FormInput } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { updateSiteSettings } from "../../actions"
import { toast } from "sonner"
import type { SiteSettings } from "@/lib/api/types"
import { Button } from "@/components/ui/button"

export const GeneralSettings = ({
  shopId,
  siteSettings
}: {
  shopId: string
  siteSettings: SiteSettings | null
}) => {
  const form = useForm()

  const onSubmit = async (data: Partial<SiteSettings>) => {
    const res = await updateSiteSettings(shopId, data)

    if (res.success) {
      toast.success("Site settings updated")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Manage your shop's general settings.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2" />
          </div>
        </div>

        <FormInput
          name="name"
          label="Name"
          placeholder="Enter your shop name"
          value={siteSettings?.name}
        />
        <FormInput
          name="address"
          label="Address"
          placeholder="Enter your shop address"
          value={siteSettings?.address}
        />
        <FormInput
          name="phone"
          label="Phone"
          placeholder="Enter your shop phone"
          value={siteSettings?.phoneNumber}
        />
        <FormInput
          name="email"
          label="Email"
          placeholder="Enter your shop email"
          value={siteSettings?.email}
        />
        <FormInput
          name="facebookUrl"
          label="Facebook URL"
          placeholder="Enter your shop Facebook URL"
          value={siteSettings?.facebookUrl}
        />
        <FormInput
          name="instagramUrl"
          label="Instagram URL"
          placeholder="Enter your shop Instagram URL"
          value={siteSettings?.instagramUrl}
        />
        <FormInput
          name="whatsappUrl"
          label="WhatsApp URL"
          placeholder="Enter your shop WhatsApp URL"
          value={siteSettings?.whatsappUrl}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
