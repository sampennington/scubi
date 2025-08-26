import { registerBlock } from "../core/register-block"
import { GalleryContentSchema } from "../schemas"
import { GalleryBlock } from "@/components/blocks/content/gallery"
import { defaultGalleryContent } from "@/components/blocks/content/gallery/defaults"

/**
 * Gallery Block Definition
 */
export const galleryBlockDefinition = {
  id: "gallery",
  name: "Image Gallery",
  description: "Display multiple images in a grid or carousel layout",
  category: "content" as const,
  icon: "images",
  component: GalleryBlock,
  schema: GalleryContentSchema,
  settings: {
    sections: [
      {
        id: "content",
        title: "Content",
        fields: [
          {
            type: "text" as const,
            name: "title",
            label: "Gallery Title",
            description: "Optional title for the gallery",
            defaultValue: "Our Gallery"
          },
          {
            type: "textarea" as const,
            name: "description",
            label: "Description",
            description: "Optional description for the gallery",
            rows: 2,
            defaultValue: "Browse through our collection"
          },
          {
            type: "array" as const,
            name: "images",
            label: "Gallery Images",
            description: "Add images to your gallery",
            itemSchema: {
              type: "object" as const,
              name: "image",
              label: "Image",
              fields: [
                {
                  type: "image" as const,
                  name: "src",
                  label: "Image",
                  required: true,
                  defaultValue: ""
                },
                {
                  type: "text" as const,
                  name: "alt",
                  label: "Alt Text",
                  required: true,
                  defaultValue: ""
                },
                {
                  type: "text" as const,
                  name: "caption",
                  label: "Caption",
                  defaultValue: ""
                }
              ]
            },
            addButtonText: "Add Image",
            minItems: 1
          }
        ]
      },
      {
        id: "layout",
        title: "Layout Options",
        fields: [
          {
            type: "select" as const,
            name: "layout",
            label: "Layout Style",
            options: [
              { value: "grid", label: "Grid" },
              { value: "carousel", label: "Carousel" },
              { value: "masonry", label: "Masonry" }
            ],
            defaultValue: "grid"
          },
          {
            type: "select" as const,
            name: "columns",
            label: "Columns",
            options: [
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" }
            ],
            defaultValue: "3"
          },
          {
            type: "toggle" as const,
            name: "showCaptions",
            label: "Show Captions",
            defaultValue: true
          }
        ]
      }
    ]
  },
  defaults: defaultGalleryContent,
  preview: {
    thumbnail: "/block-previews/gallery.jpg",
    category: "Media",
    tags: ["gallery", "images", "photos", "grid"],
    description: "Display multiple images in various layouts"
  }
}

// Auto-register the block
registerBlock(galleryBlockDefinition)

export default galleryBlockDefinition