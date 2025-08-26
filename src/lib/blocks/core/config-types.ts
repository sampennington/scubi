import { z } from "zod"

// Base field configuration
export interface BaseFieldConfig {
  name: string
  label: string
  description?: string
  required?: boolean
  defaultValue?: any
  conditions?: ConditionConfig[]
}

// Different field types
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "textarea" | "email" | "url"
  placeholder?: string
  maxLength?: number
  rows?: number // for textarea
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select"
  options: Array<{ value: string; label: string }>
  multiple?: boolean
}

export interface ToggleFieldConfig extends BaseFieldConfig {
  type: "toggle"
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number"
  min?: number
  max?: number
  step?: number
}

export interface ColorFieldConfig extends BaseFieldConfig {
  type: "color"
  format?: "hex" | "rgb" | "hsl"
}

export interface ImageFieldConfig extends BaseFieldConfig {
  type: "image"
  accept?: string
  maxSize?: number
}

export interface RangeFieldConfig extends BaseFieldConfig {
  type: "range"
  min: number
  max: number
  step?: number
}

export interface ObjectFieldConfig extends BaseFieldConfig {
  type: "object"
  fields: FieldConfig[]
}

export interface ArrayFieldConfig extends BaseFieldConfig {
  type: "array"
  itemSchema: FieldConfig
  minItems?: number
  maxItems?: number
  addButtonText?: string
}

// Union of all field types
export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | ToggleFieldConfig
  | NumberFieldConfig
  | ColorFieldConfig
  | ImageFieldConfig
  | RangeFieldConfig
  | ObjectFieldConfig
  | ArrayFieldConfig

// Conditional rendering
export interface ConditionConfig {
  field: string
  operator: "equals" | "not_equals" | "contains" | "exists" | "greater_than" | "less_than"
  value?: any
}

// Settings organization
export interface SettingsSection {
  id: string
  title: string
  description?: string
  icon?: string
  fields: FieldConfig[]
  collapsible?: boolean
  defaultOpen?: boolean
}

export interface SettingsConfig {
  sections: SettingsSection[]
}

// Preview configuration
export interface PreviewConfig {
  thumbnail?: string
  category?: string
  tags?: string[]
  description?: string
}

// Complete block configuration
export interface BlockConfig {
  id: string
  name: string
  description?: string
  category: "layout" | "content" | "media" | "commerce" | "social" | "interactive" | "specialized"
  icon?: string
  schema: z.ZodSchema
  settings: SettingsConfig
  preview?: PreviewConfig
  version?: string
  deprecated?: boolean
}

// Registry types
export interface BlockRegistry {
  blocks: Map<string, BlockConfig>
  categories: Map<string, BlockConfig[]>
}

// Form state management
export interface FieldState {
  value: any
  error?: string
  touched: boolean
  visible: boolean
}

export interface FormState {
  fields: Record<string, FieldState>
  isValid: boolean
  isDirty: boolean
}

// Helper types for type inference
export type InferBlockContent<T extends BlockConfig> = T["schema"] extends z.ZodSchema<infer U>
  ? U
  : never

export type BlockConfigMap = Record<string, BlockConfig>

// Validation helpers
export const validateFieldConfig = (config: FieldConfig): boolean => {
  // Basic validation - could be extended
  return !!(config.name && config.label && config.type)
}

export const validateSettingsConfig = (config: SettingsConfig): boolean => {
  return config.sections.every((section) =>
    section.fields.every((field) => validateFieldConfig(field))
  )
}
