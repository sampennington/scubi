import { registerBlock } from "../core/register-block"
import { TextContentSchema } from "../schemas"
import { TextBlock } from "@/components/blocks/content/text"
import { defaultTextContent } from "@/components/blocks/content/text/defaults"

/**
 * Text Block Definition
 */
export const textBlockDefinition = {
  id: "text",
  name: "Text Block",
  description: "Simple text content with alignment options",
  category: "content" as const,
  icon: "type",
  component: TextBlock,
  schema: TextContentSchema,
  settings: {
    sections: [
      {
        id: "content",
        title: "Content",
        fields: [
          {
            type: "textarea" as const,
            name: "text",
            label: "Text Content",
            description: "The text content to display",
            required: true,
            rows: 4,
            defaultValue: "Enter your text here"
          },
          {
            type: "select" as const,
            name: "alignment",
            label: "Text Alignment",
            description: "How to align the text",
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" }
            ],
            defaultValue: "left"
          }
        ]
      }
    ]
  },
  defaults: defaultTextContent,
  preview: {
    thumbnail: "/block-previews/text.jpg",
    category: "Content",
    tags: ["text", "content", "paragraph"],
    description: "Simple text content block"
  }
}

registerBlock(textBlockDefinition)

export default textBlockDefinition
