import { TrendingUp } from "lucide-react"
import type { BlockConfig } from "../../../../lib/blocks/core/config-types"
import { defaultStatsContent } from "./stats.default"
import { StatsContentSchema } from "./stats.schema"

export const statsBlockConfig: BlockConfig = {
  id: "stats",
  name: "Stats",
  description: "Display statistics in a grid layout with editable values and labels",
  category: "content",
  icon: TrendingUp,
  schema: StatsContentSchema,
  default: defaultStatsContent,
  preview: {
    thumbnail: "/block-previews/stats.jpg",
    category: "Content",
    tags: ["stats", "numbers", "metrics", "data"],
    description: "Showcase impressive statistics and key metrics"
  },
  settings: {
    sections: [
      {
        id: "content",
        title: "Content",
        description: "Heading text and statistics",
        fields: [
          {
            type: "text",
            name: "title",
            label: "Title",
            description: "Optional heading above the statistics",
            placeholder: "Our Achievements",
            maxLength: 100
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            description: "Optional subtitle text below the title",
            placeholder: "Discover the numbers that showcase our expertise...",
            rows: 2,
            maxLength: 200
          }
        ]
      },
      {
        id: "stats",
        title: "Statistics",
        description: "Configure the statistics to display",
        fields: [
          {
            type: "array",
            name: "stats",
            label: "Statistics",
            description: "Add, remove, or edit statistics",
            minItems: 1,
            maxItems: 6,
            itemSchema: {
              type: "object",
              name: "stat",
              label: "Statistic",
              fields: [
                {
                  type: "text",
                  name: "label",
                  label: "Label",
                  description: "Description text for this statistic",
                  placeholder: "Successful Dives Guided",
                  required: true,
                  maxLength: 50
                },
                {
                  type: "text",
                  name: "value",
                  label: "Value",
                  description: "The statistic number or value",
                  placeholder: "2,500+",
                  required: true,
                  maxLength: 20
                }
              ]
            },
            defaultValue: [
              {
                label: "Successful Dives Guided",
                value: "2,500+"
              }
            ]
          }
        ]
      },
      {
        id: "layout",
        title: "Layout",
        description: "Control the visual layout and styling",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "select",
            name: "layout",
            label: "Layout Style",
            description: "How to arrange the statistics",
            options: [
              { value: "grid", label: "Grid" },
              { value: "horizontal", label: "Horizontal" }
            ],
            defaultValue: "grid"
          },
          {
            type: "select",
            name: "columns",
            label: "Columns",
            description: "Number of columns in grid layout",
            options: [
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" }
            ],
            defaultValue: "3",
            conditions: [
              {
                field: "layout",
                operator: "equals",
                value: "grid"
              }
            ]
          },
          {
            type: "select",
            name: "alignment",
            label: "Text Alignment",
            description: "How to align the statistics content",
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" }
            ],
            defaultValue: "center"
          }
        ]
      },
      {
        id: "styling",
        title: "Styling",
        description: "Background and text color customization",
        collapsible: true,
        defaultOpen: false,
        fields: [
          {
            type: "color",
            name: "backgroundColor",
            label: "Background Color",
            description: "Background color for the stats section",
            defaultValue: "#111827"
          },
          {
            type: "color",
            name: "textColor",
            label: "Text Color",
            description: "Color for the statistic values",
            defaultValue: "#ffffff"
          }
        ]
      }
    ]
  },
  version: "1.0.0"
}
