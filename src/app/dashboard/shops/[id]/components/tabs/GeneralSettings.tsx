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
            Some general settings about your shop.
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
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter your shop phone number"
          value={siteSettings?.phoneNumber}
          rules={{
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone number must be a valid number"
            }
          }}
        />
        <FormInput
          name="email"
          label="Email"
          placeholder="Enter your shop email"
          value={siteSettings?.email}
          rules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email must be a valid email address"
            }
          }}
        />
        <FormInput
          name="facebookUrl"
          label="Facebook URL"
          placeholder="Enter your shop Facebook URL"
          value={siteSettings?.facebookUrl}
          rules={{
            pattern: {
              value: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_-]+\/?$/,
              message: "Facebook URL must be a valid URL"
            }
          }}
        />
        <FormInput
          name="instagramUrl"
          label="Instagram URL"
          placeholder="Enter your shop Instagram URL"
          value={siteSettings?.instagramUrl}
          rules={{
            pattern: {
              value:
                /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_-]+\/?$/,
              message: "Instagram URL must be a valid URL"
            }
          }}
        />
        <FormInput
          name="whatsappUrl"
          label="WhatsApp URL"
          placeholder="Enter your shop WhatsApp URL. E.g. wa.me/6457890"
          value={siteSettings?.whatsappUrl}
          rules={{
            pattern: {
              value: /^(https?:\/\/)?(www\.)?wa\.me\/[0-9]+$/,
              message: "WhatsApp URL must be a valid URL. E.g. wa.me/6457890"
            }
          }}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
