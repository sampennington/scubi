"use client"

import type { BlockConfig, BlockRegistry as IBlockRegistry } from "./config-types"

class BlockRegistry implements IBlockRegistry {
  public blocks = new Map<string, BlockConfig>()
  public categories = new Map<string, BlockConfig[]>()

  register(config: BlockConfig): void {
    // Validate config before registration
    if (!config.id || !config.name || !config.schema || !config.settings) {
      throw new Error(`Invalid block config for ${config.id}`)
    }

    // Register the block
    this.blocks.set(config.id, config)

    // Update category mapping
    if (!this.categories.has(config.category)) {
      this.categories.set(config.category, [])
    }

    const categoryBlocks = this.categories.get(config.category)!
    const existingIndex = categoryBlocks.findIndex((b) => b.id === config.id)

    if (existingIndex >= 0) {
      categoryBlocks[existingIndex] = config
    } else {
      categoryBlocks.push(config)
    }
  }

  unregister(blockId: string): boolean {
    const config = this.blocks.get(blockId)
    if (!config) return false

    // Remove from blocks map
    this.blocks.delete(blockId)

    // Remove from category
    const categoryBlocks = this.categories.get(config.category)
    if (categoryBlocks) {
      const index = categoryBlocks.findIndex((b) => b.id === blockId)
      if (index >= 0) {
        categoryBlocks.splice(index, 1)
      }
    }

    return true
  }

  get(blockId: string): BlockConfig | undefined {
    return this.blocks.get(blockId)
  }

  getByCategory(category: string): BlockConfig[] {
    return this.categories.get(category) || []
  }

  getAllBlocks(): BlockConfig[] {
    return Array.from(this.blocks.values())
  }

  getAllCategories(): string[] {
    return Array.from(this.categories.keys())
  }

  search(query: string): BlockConfig[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllBlocks().filter(
      (config) =>
        config.name.toLowerCase().includes(lowerQuery) ||
        config.description?.toLowerCase().includes(lowerQuery) ||
        config.preview?.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  // Validation helpers
  validateConfig(config: BlockConfig): string[] {
    const errors: string[] = []

    if (!config.id) errors.push("Missing required field: id")
    if (!config.name) errors.push("Missing required field: name")
    if (!config.category) errors.push("Missing required field: category")
    if (!config.schema) errors.push("Missing required field: schema")
    if (!config.settings) errors.push("Missing required field: settings")

    // Validate settings structure
    if (config.settings) {
      if (!Array.isArray(config.settings.sections)) {
        errors.push("settings.sections must be an array")
      } else {
        config.settings.sections.forEach((section, sectionIndex) => {
          if (!section.id) errors.push(`Section ${sectionIndex}: missing id`)
          if (!section.title) errors.push(`Section ${sectionIndex}: missing title`)
          if (!Array.isArray(section.fields)) {
            errors.push(`Section ${sectionIndex}: fields must be an array`)
          } else {
            section.fields.forEach((field, fieldIndex) => {
              if (!field.name)
                errors.push(`Section ${sectionIndex}, Field ${fieldIndex}: missing name`)
              if (!field.label)
                errors.push(`Section ${sectionIndex}, Field ${fieldIndex}: missing label`)
              if (!field.type)
                errors.push(`Section ${sectionIndex}, Field ${fieldIndex}: missing type`)
            })
          }
        })
      }
    }

    return errors
  }

  // Development helpers
  listRegistered(): void {
    console.group("🧱 Registered Blocks")

    this.getAllCategories().forEach((category) => {
      const blocks = this.getByCategory(category)
      console.group(`📁 ${category} (${blocks.length})`)

      blocks.forEach((block) => {
        console.log(`  • ${block.name} (${block.id})${block.deprecated ? " [DEPRECATED]" : ""}`)

        const validation = this.validateConfig(block)
        if (validation.length > 0) {
          console.warn(`    ⚠️ Validation errors:`, validation)
        }
      })

      console.groupEnd()
    })

    console.groupEnd()
  }

  // Export/Import for debugging
  export(): Record<string, BlockConfig> {
    const exported: Record<string, BlockConfig> = {}
    this.blocks.forEach((config, id) => {
      exported[id] = config
    })
    return exported
  }

  import(configs: Record<string, BlockConfig>): void {
    Object.values(configs).forEach((config) => {
      try {
        this.register(config)
      } catch (error) {
        console.error(`Failed to import block ${config.id}:`, error)
      }
    })
  }

  // Clear all registrations (useful for testing)
  clear(): void {
    this.blocks.clear()
    this.categories.clear()
  }
}

// Global registry instance
export const blockRegistry = new BlockRegistry()

// Development helper - expose to window in dev mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).__blockRegistry = blockRegistry
}

// Registry hooks for React components
export function useBlockRegistry() {
  return blockRegistry
}

export function useBlockConfig(blockId: string) {
  return blockRegistry.get(blockId)
}

export function useBlocksByCategory(category: string) {
  return blockRegistry.getByCategory(category)
}

export { BlockRegistry }
