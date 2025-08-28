import { StickyNote } from "lucide-react"
import type { BlockConfig } from "../../../../lib/blocks/core/config-types"
import { defaultContentStickyContent } from "./content-sticky.default"
import { contentStickySchema } from "./content-sticky.schema"

export const contentStickyBlockConfig: BlockConfig = {
  id: "content-sticky",
  name: "Content with Sticky Image",
  description:
    "A content section with sticky image layout featuring text, features list, and background graphics",
  category: "content",
  icon: StickyNote,
  schema: contentStickySchema,
  default: defaultContentStickyContent,
  preview: {
    thumbnail: "/block-previews/content-sticky.jpg",
    category: "Content",
    tags: ["content", "features", "sticky", "layout"],
    description: "Content section with sticky image and feature highlights"
  },
  settings: {
    sections: [
      {
        id: "header",
        title: "Header Content",
        description: "Top section with eyebrow, title and subtitle",
        fields: [
          {
            type: "text",
            name: "eyebrow",
            label: "Eyebrow Text",
            description: "Small text above the main title",
            placeholder: "Deploy faster",
            maxLength: 50,
            defaultValue: "Deploy faster"
          },
          {
            type: "text",
            name: "title",
            label: "Main Title",
            description: "Primary heading for the section",
            placeholder: "A better workflow",
            required: true,
            maxLength: 100,
            defaultValue: "A better workflow"
          },
          {
            type: "textarea",
            name: "subtitle",
            label: "Subtitle",
            description: "Supporting text below the title",
            placeholder: "Describe your workflow improvements...",
            rows: 3,
            maxLength: 300,
            defaultValue:
              "Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae feugiat egestas."
          }
        ]
      },
      {
        id: "media",
        title: "Sticky Image",
        description: "Image that stays sticky on desktop",
        fields: [
          {
            type: "image",
            name: "image",
            label: "Featured Image",
            description: "Main image for the content section",
            accept: "image/*",
            aspectRatio: "4/3",
            defaultValue:
              "https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
          },
          {
            type: "text",
            name: "imageAlt",
            label: "Image Alt Text",
            description: "Accessibility description for the image",
            placeholder: "App Screenshot",
            maxLength: 100,
            defaultValue: "App Screenshot"
          }
        ]
      },
      {
        id: "content",
        title: "Main Content",
        description: "Body content and feature details",
        fields: [
          {
            type: "textarea",
            name: "content",
            label: "Main Content",
            description: "Primary content text",
            placeholder: "Describe your main content...",
            rows: 4,
            maxLength: 500,
            defaultValue:
              "Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit."
          }
        ]
      },
      {
        id: "bottom",
        title: "Bottom Section",
        description: "Additional title and content at the bottom",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "text",
            name: "bottomTitle",
            label: "Bottom Title",
            description: "Secondary heading at the bottom",
            placeholder: "No server? No problem.",
            maxLength: 100,
            defaultValue: "No server? No problem."
          },
          {
            type: "textarea",
            name: "bottomContent",
            label: "Bottom Content",
            description: "Additional content at the bottom",
            placeholder: "Additional content...",
            rows: 3,
            maxLength: 400,
            defaultValue:
              "Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh. Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh."
          }
        ]
      }
    ]
  },
  version: "1.0.0"
}
