import type { ComponentType } from "react"
import type { ZodSchema } from "zod"
import type { BlockConfig, SettingsConfig } from "./config-types"
import { blockRegistry } from "./registry"

export interface BlockDefinition<T = unknown> {
  id: string
  name: string
  description?: string
  category: "layout" | "content" | "media" | "commerce" | "social" | "interactive" | "specialized"
  icon?: string
  component: ComponentType<{ content?: T }>
  schema: ZodSchema<T>
  settings: SettingsConfig
  defaults: T
  preview?: {
    thumbnail?: string
    category?: string
    tags?: string[]
    description?: string
  }
  version?: string
  deprecated?: boolean
}

/**
 * Register a block with enhanced type safety and auto-completion
 *
 * @example
 * ```typescript
 * registerBlock({
 *   id: 'hero',
 *   name: 'Hero Section',
 *   category: 'layout',
 *   component: HeroComponent,
 *   schema: heroSchema,
 *   settings: heroSettings,
 *   defaults: heroDefaults
 * })
 * ```
 */
export function registerBlock<T>(definition: BlockDefinition<T>): void {
  const errors = validateBlockDefinition(definition)
  if (errors.length > 0) {
    throw new Error(`Block registration failed for "${definition.id}":\n${errors.join("\n")}`)
  }

  const config: BlockConfig = {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    category: definition.category,
    icon: definition.icon,
    schema: definition.schema,
    settings: definition.settings,
    preview: definition.preview,
    version: definition.version || "1.0.0",
    deprecated: definition.deprecated || false
  }

  blockRegistry.register(config)

  if (process.env.NODE_ENV === "development") {
    console.log(`🧱 Registered block: ${definition.name} (${definition.id})`)
  }
}

/**
 * Register multiple blocks at once
 */
export function registerBlocks<T>(definitions: BlockDefinition<T>[]): void {
  definitions.forEach((def) => registerBlock(def))
}

/**
 * Validate a block definition before registration
 */
function validateBlockDefinition<T>(definition: BlockDefinition<T>): string[] {
  const errors: string[] = []

  if (!definition.id) {
    errors.push("Missing required field: id")
  }

  if (!definition.name) {
    errors.push("Missing required field: name")
  }

  if (!definition.category) {
    errors.push("Missing required field: category")
  }

  if (!definition.component) {
    errors.push("Missing required field: component")
  }

  if (!definition.schema) {
    errors.push("Missing required field: schema")
  }

  if (!definition.settings) {
    errors.push("Missing required field: settings")
  }

  if (!definition.defaults) {
    errors.push("Missing required field: defaults")
  }

  // Validate schema with defaults
  if (definition.schema && definition.defaults) {
    try {
      const result = definition.schema.safeParse(definition.defaults)
      if (!result.success) {
        errors.push(`Default data doesn't match schema: ${result.error.message}`)
      }
    } catch (error) {
      errors.push(`Schema validation failed: ${error}`)
    }
  }

  const validCategories = [
    "layout",
    "content",
    "media",
    "commerce",
    "social",
    "interactive",
    "specialized"
  ]
  if (definition.category && !validCategories.includes(definition.category)) {
    errors.push(
      `Invalid category "${definition.category}". Must be one of: ${validCategories.join(", ")}`
    )
  }

  return errors
}

/**
 * Create a typed block definition helper
 * This provides better TypeScript inference for block definitions
 */
export function createBlockDefinition<T>(definition: BlockDefinition<T>): BlockDefinition<T> {
  return definition
}

/**
 * Utility to check if a block is registered
 */
export function isBlockRegistered(blockId: string): boolean {
  return blockRegistry.get(blockId) !== undefined
}

/**
 * Utility to get all registered block IDs
 */
export function getRegisteredBlockIds(): string[] {
  return Array.from(blockRegistry.blocks.keys())
}

/**
 * Development helper to list all registered blocks with their status
 */
export function listRegisteredBlocks(): void {
  if (process.env.NODE_ENV !== "development") {
    console.warn("listRegisteredBlocks() is only available in development mode")
    return
  }

  blockRegistry.listRegistered()
}
