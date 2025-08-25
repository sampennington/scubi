// Block configuration exports
export { heroBlockConfig } from "./hero.config"

// Registry setup
import { blockRegistry } from "../core/registry"
import { heroBlockConfig } from "./hero.config"

// Auto-register all block configurations
export function registerAllBlocks() {
  try {
    // Register hero block
    blockRegistry.register(heroBlockConfig)
    
    // Add more blocks here as they're created
    // blockRegistry.register(textBlockConfig)
    // blockRegistry.register(galleryBlockConfig)
    // etc...
    
    if (process.env.NODE_ENV === "development") {
      console.log("🧱 Registered blocks:")
      blockRegistry.listRegistered()
    }
  } catch (error) {
    console.error("❌ Failed to register blocks:", error)
  }
}

// Call this function to initialize all blocks
registerAllBlocks()