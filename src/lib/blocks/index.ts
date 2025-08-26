// Core exports
export * from './core/config-types'
export { blockRegistry, BlockRegistry, useBlockRegistry, useBlockConfig, useBlocksByCategory } from './core/registry'

// Registration utilities
export * from './core/register-block'

// Schema exports 
export * from './schemas'

// Auto-register all blocks
// This imports all block definitions and registers them automatically
import './definitions'

// Config exports (legacy support)
export * from './configs'

// Default data exports (now co-located with components)
// Use individual component folders for defaults, or shared/defaults-index.ts for compatibility