/**
 * @deprecated Block registration is now handled automatically through the definitions system.
 * 
 * New blocks are registered by:
 * 1. Creating a definition file in src/lib/blocks/definitions/[name].definition.ts
 * 2. The definition file automatically registers the block
 * 3. All definitions are imported through src/lib/blocks/definitions/index.ts
 * 
 * Legacy configs are still exported for backward compatibility.
 */

// Legacy block configuration exports
export { heroBlockConfig } from "./hero.config"

// The new registration system handles everything automatically
// No need to manually call registration functions anymore
console.log("ℹ️  Block registration is now automatic through the definitions system")