// Schema exports
export {
  BackgroundConfigSchema,
  BackgroundTypeEnum,
  BackgroundColorSchema,
  BackgroundGradientSchema,
  BackgroundImageSchema,
  BackgroundNoneSchema,
  defaultBackgroundConfig,
  isBackgroundConfig
} from "./background.schema"

export type {
  BackgroundType,
  BackgroundColor,
  BackgroundGradient, 
  BackgroundImage,
  BackgroundNone,
  BackgroundConfig
} from "./background.schema"

// Settings configuration
export { backgroundSettingsSection } from "./background.config"

// Utility functions
export {
  getBackgroundClasses,
  getBackgroundStyles,
  applyBackground,
  applyBackgroundWithExisting
} from "./background.utils"