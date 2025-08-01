"use client"
import { Form, FormInput } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { updateSiteSettings } from "../../actions"
import { toast } from "sonner"
import type { SiteSettings } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/ui/color-picker"
import { SettingsSection } from "./SettingsSection"

export const GeneralSettings = ({
  shopId,
  siteSettings
}: {
  shopId: string
  siteSettings: SiteSettings | null
}) => {
  const form = useForm({
    defaultValues: {
      name: siteSettings?.name || "",
      address: siteSettings?.address || "",
      phoneNumber: siteSettings?.phoneNumber || "",
      email: siteSettings?.email || "",
      facebookUrl: siteSettings?.facebookUrl || "",
      instagramUrl: siteSettings?.instagramUrl || "",
      whatsappUrl: siteSettings?.whatsappUrl || "",
      primaryColor: siteSettings?.primaryColor || "#3b82f6",
      secondaryColor: siteSettings?.secondaryColor || "#64748b",
      accentColor: siteSettings?.accentColor || "#f59e0b",
      fontFamilyHeading: siteSettings?.fontFamilyHeading || "",
      fontFamilyBody: siteSettings?.fontFamilyBody || ""
    }
  })

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

        <SettingsSection title="Contact Details">
          <FormInput
            name="name"
            label="Your Shop Name"
            placeholder="Enter your shop name"
          />
          <FormInput
            name="address"
            label="Address"
            placeholder="Enter your shop address"
          />
          <FormInput
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter your shop phone number"
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
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email must be a valid email address"
              }
            }}
          />
        </SettingsSection>
        <SettingsSection title="Socials">
          <FormInput
            name="facebookUrl"
            label="Facebook URL"
            placeholder="Enter your shop Facebook URL"
            rules={{
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_-]+\/?$/,
                message: "Facebook URL must be a valid URL"
              }
            }}
          />
          <FormInput
            name="instagramUrl"
            label="Instagram URL"
            placeholder="Enter your shop Instagram URL"
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
            rules={{
              pattern: {
                value: /^(https?:\/\/)?(www\.)?wa\.me\/[0-9]+$/,
                message: "WhatsApp URL must be a valid URL. E.g. wa.me/6457890"
              }
            }}
          />
        </SettingsSection>
        <SettingsSection title="Theme">
          <div>
            <label htmlFor="primary-color" className="text-sm font-medium">
              Primary Color
            </label>
            <ColorPicker
              color={form.watch("primaryColor")}
              onChange={(color) => form.setValue("primaryColor", color)}
            />
          </div>
          <div>
            <label htmlFor="secondary-color" className="text-sm font-medium">
              Secondary Color
            </label>
            <ColorPicker
              color={form.watch("secondaryColor")}
              onChange={(color) => form.setValue("secondaryColor", color)}
            />
          </div>
          <div>
            <label htmlFor="accent-color" className="text-sm font-medium">
              Accent Color
            </label>
            <ColorPicker
              color={form.watch("accentColor")}
              onChange={(color) => form.setValue("accentColor", color)}
            />
          </div>
          <FormInput
            name="fontFamilyHeading"
            label="Headings Font Family"
            placeholder="Font family for headings"
          />
          <FormInput
            name="fontFamilyBody"
            label="Body Font Family"
            placeholder="Font family for body text"
          />
        </SettingsSection>
        <Button className="mt-4" type="submit">
          Save
        </Button>
      </form>
    </Form>
  )
}
