import type { SettingsSection } from "@/lib/blocks/core/config-types"

export const backgroundSettingsSection: SettingsSection = {
  id: "background",
  title: "Background",
  description: "Configure the background appearance",
  collapsible: true,
  defaultOpen: false,
  fields: [
    {
      type: "select",
      name: "background.type",
      label: "Background Type",
      description: "Choose the type of background",
      defaultValue: "none",
      options: [
        { value: "none", label: "None" },
        { value: "color", label: "Solid Color" },
        { value: "gradient", label: "Gradient" },
        { value: "image", label: "Image" }
      ]
    },
    {
      type: "color",
      name: "background.color",
      label: "Background Color", 
      description: "Solid background color",
      defaultValue: "#ffffff",
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "color"
        }
      ]
    },
    {
      type: "select",
      name: "background.direction",
      label: "Gradient Direction",
      description: "Direction of the gradient",
      defaultValue: "to-r",
      options: [
        { value: "to-r", label: "Left to Right" },
        { value: "to-l", label: "Right to Left" },
        { value: "to-t", label: "Bottom to Top" },
        { value: "to-b", label: "Top to Bottom" },
        { value: "to-tr", label: "Bottom-left to Top-right" },
        { value: "to-tl", label: "Bottom-right to Top-left" },
        { value: "to-br", label: "Top-left to Bottom-right" },
        { value: "to-bl", label: "Top-right to Bottom-left" }
      ],
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "gradient"
        }
      ]
    },
    {
      type: "color",
      name: "background.fromColor",
      label: "From Color",
      description: "Starting color of the gradient",
      defaultValue: "#3b82f6",
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "gradient"
        }
      ]
    },
    {
      type: "color",
      name: "background.toColor", 
      label: "To Color",
      description: "Ending color of the gradient",
      defaultValue: "#1d4ed8",
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "gradient"
        }
      ]
    },
    {
      type: "image",
      name: "background.url",
      label: "Background Image",
      description: "Upload or select a background image",
      accept: "image/*",
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "image"
        }
      ]
    },
    {
      type: "select",
      name: "background.position",
      label: "Image Position",
      description: "Position of the background image",
      defaultValue: "center",
      options: [
        { value: "center", label: "Center" },
        { value: "top", label: "Top" },
        { value: "bottom", label: "Bottom" },
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "top-left", label: "Top Left" },
        { value: "top-right", label: "Top Right" },
        { value: "bottom-left", label: "Bottom Left" },
        { value: "bottom-right", label: "Bottom Right" }
      ],
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "image"
        }
      ]
    },
    {
      type: "select",
      name: "background.size",
      label: "Image Size",
      description: "How the background image should be sized",
      defaultValue: "cover",
      options: [
        { value: "cover", label: "Cover (fill area, may crop)" },
        { value: "contain", label: "Contain (fit entire image)" },
        { value: "auto", label: "Auto (original size)" }
      ],
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "image"
        }
      ]
    },
    {
      type: "select",
      name: "background.repeat",
      label: "Image Repeat",
      description: "How the background image should repeat",
      defaultValue: "no-repeat",
      options: [
        { value: "no-repeat", label: "No Repeat" },
        { value: "repeat", label: "Repeat" },
        { value: "repeat-x", label: "Repeat Horizontally" },
        { value: "repeat-y", label: "Repeat Vertically" }
      ],
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "image"
        }
      ]
    },
    {
      type: "toggle",
      name: "background.overlay.enabled",
      label: "Enable Overlay",
      description: "Add a color overlay on top of the background image",
      defaultValue: false,
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "image"
        }
      ]
    },
    {
      type: "color",
      name: "background.overlay.color",
      label: "Overlay Color",
      description: "Color of the overlay (supports alpha/transparency)",
      defaultValue: "rgba(0, 0, 0, 0.5)",
      conditions: [
        {
          field: "background.type",
          operator: "equals",
          value: "image"
        },
        {
          field: "background.overlay.enabled",
          operator: "equals",
          value: true
        }
      ]
    }
  ]
}