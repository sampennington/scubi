import type { BackgroundConfig } from "./background.schema"
import { cn } from "@/lib/utils"

/**
 * Generate CSS classes for a background configuration
 */
export function getBackgroundClasses(background: BackgroundConfig): string {
  if (!background || background.type === "none") {
    return ""
  }

  const classes: string[] = []

  switch (background.type) {
    case "color":
      // For solid colors, we'll use inline styles since Tailwind doesn't have all colors
      break

    case "gradient": {
      // Tailwind gradient classes
      const directionClass = `bg-gradient-${background.direction}`
      classes.push(directionClass)
      // Gradient colors will be applied via inline styles since we need custom colors
      break
    }

    case "image":
      // Background image utility classes
      classes.push("bg-cover") // default, will be overridden by specific size class
      
      switch (background.size) {
        case "cover":
          classes.push("bg-cover")
          break
        case "contain":
          classes.push("bg-contain")
          break
        case "auto":
          classes.push("bg-auto")
          break
      }

      switch (background.position) {
        case "center":
          classes.push("bg-center")
          break
        case "top":
          classes.push("bg-top")
          break
        case "bottom":
          classes.push("bg-bottom")
          break
        case "left":
          classes.push("bg-left")
          break
        case "right":
          classes.push("bg-right")
          break
        case "top-left":
          classes.push("bg-left-top")
          break
        case "top-right":
          classes.push("bg-right-top")
          break
        case "bottom-left":
          classes.push("bg-left-bottom")
          break
        case "bottom-right":
          classes.push("bg-right-bottom")
          break
      }

      switch (background.repeat) {
        case "no-repeat":
          classes.push("bg-no-repeat")
          break
        case "repeat":
          classes.push("bg-repeat")
          break
        case "repeat-x":
          classes.push("bg-repeat-x")
          break
        case "repeat-y":
          classes.push("bg-repeat-y")
          break
      }
      break
  }

  return cn(classes)
}

/**
 * Generate inline CSS styles for a background configuration
 */
export function getBackgroundStyles(background: BackgroundConfig): React.CSSProperties {
  if (!background || background.type === "none") {
    return {}
  }

  const styles: React.CSSProperties = {}

  switch (background.type) {
    case "color":
      styles.backgroundColor = background.color
      break

    case "gradient": {
      // Create gradient based on direction and colors
      const gradientDirection = getGradientDirection(background.direction)
      styles.backgroundImage = `linear-gradient(${gradientDirection}, ${background.fromColor}, ${background.toColor})`
      break
    }

    case "image":
      if (background.overlay?.enabled) {
        // Create composite background with overlay
        const overlayGradient = `linear-gradient(${background.overlay.color}, ${background.overlay.color})`
        styles.backgroundImage = `${overlayGradient}, url("${background.url}")`
      } else {
        styles.backgroundImage = `url("${background.url}")`
      }
      break
  }

  return styles
}

/**
 * Convert background direction enum to CSS gradient direction
 */
function getGradientDirection(direction: string): string {
  switch (direction) {
    case "to-r":
      return "to right"
    case "to-l":
      return "to left"
    case "to-t":
      return "to top"
    case "to-b":
      return "to bottom"
    case "to-tr":
      return "to top right"
    case "to-tl":
      return "to top left"
    case "to-br":
      return "to bottom right"
    case "to-bl":
      return "to bottom left"
    default:
      return "to right"
  }
}

/**
 * Apply background configuration to an element
 * Returns both className and style props for React components
 */
export function applyBackground(background: BackgroundConfig) {
  return {
    className: getBackgroundClasses(background),
    style: getBackgroundStyles(background)
  }
}

/**
 * Merge background configuration with existing className and styles
 */
export function applyBackgroundWithExisting(
  background: BackgroundConfig,
  existingClassName?: string,
  existingStyles?: React.CSSProperties
) {
  const backgroundProps = applyBackground(background)
  
  return {
    className: cn(existingClassName, backgroundProps.className),
    style: { ...existingStyles, ...backgroundProps.style }
  }
}