import { LayoutPanelTop } from "lucide-react"
import type { BlockConfig } from "../../../../lib/blocks/core/config-types"
import { defaultHeroContent } from "./hero.default"
import { HeroContentSchema } from "./hero.schema"
import { backgroundSettingsSection } from "../../shared/background"

export const heroBlockConfig: BlockConfig = {
  id: "hero",
  name: "Hero Section",
  description:
    "A full-width hero section with title, description, background image, and call-to-action buttons",
  category: "layout",
  icon: LayoutPanelTop,
  schema: HeroContentSchema,
  default: defaultHeroContent,
  preview: {
    thumbnail: "/block-previews/hero.jpg",
    category: "Headers",
    tags: ["header", "banner", "cta", "hero"],
    description: "Eye-catching header section for landing pages"
  },
  settings: {
    sections: [
      {
        id: "content",
        title: "Content",
        description: "Main headline and supporting text",
        fields: [
          {
            type: "text",
            name: "title",
            label: "Headline",
            description: "Main headline text that grabs attention",
            placeholder: "Discover the Underwater World",
            required: true,
            maxLength: 100,
            defaultValue: "Discover the Underwater World"
          },
          {
            type: "textarea",
            name: "text",
            label: "Description",
            description: "Supporting text below the headline",
            placeholder: "Professional dive training and underwater adventures...",
            rows: 3,
            maxLength: 300,
            defaultValue:
              "Professional dive training and unforgettable underwater adventures await. From beginner courses to advanced certifications, explore the ocean's wonders with our expert instructors."
          }
        ]
      },
      backgroundSettingsSection,
      {
        id: "branding",
        title: "Branding",
        description: "Logo and company branding",
        fields: [
          {
            type: "image",
            name: "logo",
            label: "Logo",
            description: "Company logo displayed in navigation",
            accept: "image/*",
            aspectRatio: "1/1",
            defaultValue:
              "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          }
        ]
      },
      {
        id: "primaryButton",
        title: "Primary Button",
        description: "Main call-to-action button",
        fields: [
          {
            type: "text",
            name: "primaryButton.label",
            label: "Button Text",
            description: "Text displayed on the primary button",
            placeholder: "Book a Dive",
            maxLength: 30,
            defaultValue: "Book a Dive"
          },
          {
            type: "url",
            name: "primaryButton.url",
            label: "Button URL",
            description: "Link destination for the primary button",
            placeholder: "https://example.com",
            defaultValue: "",
            conditions: [
              {
                field: "primaryButton.label",
                operator: "exists"
              }
            ]
          },
          {
            type: "select",
            name: "primaryButton.variant",
            label: "Button Style",
            description: "Visual appearance of the primary button",
            options: [
              { value: "default", label: "Default" },
              { value: "primary", label: "Primary" },
              { value: "secondary", label: "Secondary" },
              { value: "outline", label: "Outline" },
              { value: "ghost", label: "Ghost" },
              { value: "cta", label: "Call to Action" }
            ],
            defaultValue: "primary",
            conditions: [
              {
                field: "primaryButton.label",
                operator: "exists"
              }
            ]
          }
        ]
      },
      {
        id: "secondaryButton",
        title: "Secondary Button",
        description: "Optional secondary action button",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "text",
            name: "secondaryButton.label",
            label: "Button Text",
            description: "Text displayed on the secondary button",
            placeholder: "View Courses",
            maxLength: 30,
            defaultValue: "View Courses"
          },
          {
            type: "url",
            name: "secondaryButton.url",
            label: "Button URL",
            description: "Link destination for the secondary button",
            placeholder: "https://example.com",
            defaultValue: "",
            conditions: [
              {
                field: "secondaryButton.label",
                operator: "exists"
              }
            ]
          },
          {
            type: "select",
            name: "secondaryButton.variant",
            label: "Button Style",
            description: "Visual appearance of the secondary button",
            options: [
              { value: "default", label: "Default" },
              { value: "secondary", label: "Secondary" },
              { value: "outline", label: "Outline" },
              { value: "ghost", label: "Ghost" }
            ],
            defaultValue: "outline",
            conditions: [
              {
                field: "secondaryButton.label",
                operator: "exists"
              }
            ]
          }
        ]
      },
      {
        id: "layout",
        title: "Layout Options",
        description: "Alignment and spacing options",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "select",
            name: "alignment",
            label: "Text Alignment",
            description: "How to align the hero content",
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" }
            ],
            defaultValue: "center"
          },
          {
            type: "range",
            name: "minHeight",
            label: "Minimum Height",
            description: "Minimum height of the hero section (in viewport height)",
            min: 20,
            max: 100,
            step: 5,
            defaultValue: 60
          }
        ]
      }
    ]
  },
  version: "1.0.0"
}
