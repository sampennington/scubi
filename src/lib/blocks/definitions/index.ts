/**
 * Block Definitions Index
 * 
 * This file imports all block definitions, which automatically registers them
 * with the global block registry through their individual definition files.
 * 
 * To add a new block:
 * 1. Create the block component in src/components/blocks/[category]/[name]/
 * 2. Create defaults in [component-folder]/defaults.ts
 * 3. Create definition in src/lib/blocks/definitions/[name].definition.ts
 * 4. Import it here
 * 
 * The block will be automatically registered and available throughout the app.
 */

// Layout blocks
import "./hero.definition"
// import "./two-column.definition"    // TODO: Create this
// import "./multi-column.definition" // TODO: Create this 
// import "./divider.definition"      // TODO: Create this

// Content blocks
import "./text.definition"
import "./gallery.definition"
// import "./image.definition"        // TODO: Create this
// import "./video.definition"        // TODO: Create this

// Interactive blocks
// import "./contact-form.definition" // TODO: Create this
// import "./faq.definition"          // TODO: Create this
// import "./cta.definition"          // TODO: Create this

// Social blocks  
// import "./testimonials.definition" // TODO: Create this
// import "./team.definition"         // TODO: Create this
// import "./social-feed.definition"  // TODO: Create this

// Specialized blocks
// import "./courses.definition"      // TODO: Create this
// import "./marine-life.definition"  // TODO: Create this
// import "./map.definition"          // TODO: Create this

// Development helper
if (process.env.NODE_ENV === 'development') {
  import("../core/register-block").then(({ listRegisteredBlocks }) => {
    console.log('\n🧱 Block Registration Complete')
    listRegisteredBlocks()
  })
}

// Re-export registration utilities for convenience
export { registerBlock, registerBlocks, isBlockRegistered, getRegisteredBlockIds } from "../core/register-block"
export { blockRegistry } from "../core/registry"