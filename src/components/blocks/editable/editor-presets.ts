// Feature presets for different content types
export const EDITOR_PRESETS = {
  // Headings - no rich formatting, just plain text
  heading: {
    bold: false,
    italic: false,
    underline: false,
    links: false,
    lists: false,
    headings: false,
    saveAsHtml: false
  },

  // Simple text elements - minimal formatting, save as HTML to preserve formatting
  simple: {
    bold: true,
    italic: true,
    underline: false,
    links: false,
    lists: false,
    headings: false,
    saveAsHtml: true
  },

  // Rich text content - full formatting, save as HTML
  rich: {
    bold: true,
    italic: true,
    underline: true,
    links: true,
    lists: true,
    headings: false, // We don't want nested headings in content
    saveAsHtml: true
  },

  // Button text - no formatting at all
  button: {
    bold: false,
    italic: false,
    underline: false,
    links: false,
    lists: false,
    headings: false,
    saveAsHtml: false
  },

  // Link text - only basic formatting, save as HTML to preserve formatting
  link: {
    bold: true,
    italic: true,
    underline: false,
    links: false,
    lists: false,
    headings: false,
    saveAsHtml: true
  }
} as const

export type EditorPreset = keyof typeof EDITOR_PRESETS

export function getFeaturesForElement(elementType: string) {
  switch (elementType.toLowerCase()) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return EDITOR_PRESETS.heading

    case "button":
      return EDITOR_PRESETS.button

    case "a":
      return EDITOR_PRESETS.link

    case "span":
    case "strong":
    case "b":
    case "em":
    case "i":
      return EDITOR_PRESETS.simple

    case "p":
    case "div":
    case "blockquote":
    case "article":
    case "section":
    default:
      return EDITOR_PRESETS.rich
  }
}
