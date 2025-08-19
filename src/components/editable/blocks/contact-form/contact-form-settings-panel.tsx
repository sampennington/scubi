import { Separator } from "@/components/ui/separator"
import {
  BlockSettingsPanel,
  SettingsSection,
  SettingItem
} from "@/components/editable/settings-panel"
import { useBlockEdit } from "@/components/editable/context"
import type { ContactFormContent } from "@/components/blocks/schemas"

export const ContactFormSettingsPanel = () => {
  const { content, handleEdit } = useBlockEdit<ContactFormContent>()

  const {
    title = "",
    description = "",
    submitButtonText = "Send Message",
    successMessage = "Thank you! Your message has been sent successfully.",
    emailTo = ""
  } = content

  return (
    <BlockSettingsPanel title="Contact Form Block Settings">
      <SettingsSection title="Content">
        <SettingItem label="Title" description="Form section title">
          <input
            type="text"
            value={title}
            onChange={(e) => handleEdit("title", e.target.value, true)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter form title"
          />
        </SettingItem>

        <SettingItem label="Description" description="Form description text">
          <textarea
            value={description}
            onChange={(e) => handleEdit("description", e.target.value, true)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter form description"
            rows={3}
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Form Configuration">
        <SettingItem label="Submit Button Text" description="Text displayed on the submit button">
          <input
            type="text"
            value={submitButtonText}
            onChange={(e) => handleEdit("submitButtonText", e.target.value, true)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Send Message"
          />
        </SettingItem>

        <SettingItem
          label="Success Message"
          description="Message shown after successful submission"
        >
          <input
            type="text"
            value={successMessage}
            onChange={(e) => handleEdit("successMessage", e.target.value, true)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Thank you! Your message has been sent successfully."
          />
        </SettingItem>

        <SettingItem
          label="Email Recipient"
          description="Email address to receive form submissions"
        >
          <input
            type="email"
            value={emailTo}
            onChange={(e) => handleEdit("emailTo", e.target.value, true)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="contact@example.com"
          />
        </SettingItem>
      </SettingsSection>

      <Separator />

      <SettingsSection title="Form Fields">
        <div className="text-muted-foreground text-sm">
          Form fields are managed through the block editor. Use the "Add Field" button to add new
          fields and configure their properties.
        </div>
      </SettingsSection>
    </BlockSettingsPanel>
  )
}
