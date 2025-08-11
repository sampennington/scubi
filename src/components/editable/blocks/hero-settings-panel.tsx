import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select"
import {
  BlockSettingsPanel,
  SettingsSection,
  SettingItem
} from "../block-settings-panel"
import { useBlockEdit } from "../block-edit-context"
import type { HeroContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

export const HeroSettingsPanel = () => {
  const { content, handleEdit } = useBlockEdit<HeroContent>()

  const {
    title = "",
    text = "",
    image = "",
    primaryButton = { label: "", url: "", variant: "default" },
    secondaryButton = { label: "", url: "", variant: "secondary" }
  } = content

  return (
    <BlockSettingsPanel title="Hero Block Settings">
      <SettingsSection title="Content">
        <SettingItem label="Title" description="Main headline text">
          <input
            type="text"
            value={title}
            onChange={(e) => handleEdit("title", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter hero title"
          />
        </SettingItem>

        <SettingItem
          label="Description"
          description="Supporting text below the title"
        >
          <textarea
            value={text}
            onChange={(e) => handleEdit("text", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter hero description"
            rows={3}
          />
        </SettingItem>
      </SettingsSection>

      <SettingsSection title="Primary Button">
        <SettingItem
          label="Button Text"
          description="Text displayed on the primary button"
        >
          <input
            type="text"
            value={primaryButton.label}
            onChange={(e) =>
              handleEdit("primaryButton", {
                ...primaryButton,
                label: e.target.value
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Button text"
          />
        </SettingItem>

        <SettingItem
          label="Button URL"
          description="Link destination for the primary button"
        >
          <input
            type="url"
            value={primaryButton.url}
            onChange={(e) =>
              handleEdit("primaryButton", {
                ...primaryButton,
                url: e.target.value
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="https://example.com"
          />
        </SettingItem>

        <SettingItem
          label="Button Style"
          description="Visual appearance of the primary button"
        >
          <Select
            value={primaryButton.variant}
            onValueChange={(value) =>
              handleEdit("primaryButton", { ...primaryButton, variant: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
      </SettingsSection>

      <SettingsSection title="Secondary Button">
        <SettingItem
          label="Button Text"
          description="Text displayed on the secondary button"
        >
          <input
            type="text"
            value={secondaryButton.label}
            onChange={(e) =>
              handleEdit("secondaryButton", {
                ...secondaryButton,
                label: e.target.value
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Button text"
          />
        </SettingItem>

        <SettingItem
          label="Button URL"
          description="Link destination for the secondary button"
        >
          <input
            type="url"
            value={secondaryButton.url}
            onChange={(e) =>
              handleEdit("secondaryButton", {
                ...secondaryButton,
                url: e.target.value
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="https://example.com"
          />
        </SettingItem>

        <SettingItem
          label="Button Style"
          description="Visual appearance of the secondary button"
        >
          <Select
            value={secondaryButton.variant}
            onValueChange={(value) =>
              handleEdit("secondaryButton", {
                ...secondaryButton,
                variant: value
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
      </SettingsSection>
    </BlockSettingsPanel>
  )
}
