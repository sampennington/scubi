# Block System Refactor Plan

## Phase 1: Schema Organization

### 1.1 Split Monolithic Schema File
**Current**: Single `schemas.ts` with 435 lines
**Target**: Individual schema files by block type

```bash
# Create new schema structure
mkdir -p src/lib/blocks/schemas
# Move schemas to individual files
```

**Benefits**:
- Easier maintenance and testing
- Clearer ownership per block
- Reduced merge conflicts
- Better tree-shaking

### 1.2 Consistent Schema Exports
```typescript
// src/lib/blocks/schemas/hero.schema.ts
export const heroSchema = z.object({...})
export type HeroData = z.infer<typeof heroSchema>
export const isHeroData = (data: unknown): data is HeroData => 
  heroSchema.safeParse(data).success
```

## Phase 2: Component Organization

### 2.1 Block Categories
Organize blocks by functional category:

- **Layout**: hero, two-column, divider, multi-column
- **Content**: text, image, gallery, video
- **Interactive**: contact-form, faq, call-to-action
- **Social**: testimonials, team, social-feed, reviews
- **Specialized**: courses, marine-life (dive industry specific)

### 2.2 Component Structure
Each block gets its own directory:

```
src/components/blocks/layout/hero/
├── index.ts                # Clean exports
├── hero.component.tsx      # Main component
├── hero.types.ts          # Component-specific types
├── hero.variants.tsx      # Alternative layouts
└── __tests__/
    └── hero.test.tsx      # Component tests
```

### 2.3 Consistent Naming Convention
- **Files**: `kebab-case.extension.ts`
- **Components**: `PascalCase`
- **Types**: `PascalCase` with clear suffixes (`HeroData`, `HeroProps`)

## Phase 3: Configuration Management

### 3.1 Settings Configuration
Move from scattered configs to organized structure:

```typescript
// src/lib/blocks/configs/hero.config.ts
import { SettingsConfig } from '../core/config-types'

export const heroSettingsConfig: SettingsConfig = {
  sections: [...]
}
```

### 3.2 Default Data
Split large default data file:

```typescript
// src/lib/blocks/defaults/hero.defaults.ts
import { HeroData } from '../schemas/hero.schema'

export const heroDefaults: HeroData = {
  title: "Welcome to our site",
  // ...
}
```

## Phase 4: Registry Enhancement

### 4.1 Auto-Registration
Create registration helper:

```typescript
// src/lib/blocks/core/register-block.ts
export function registerBlock<T>(config: {
  id: string
  name: string
  category: BlockCategory
  component: ComponentType<T>
  schema: ZodSchema<T>
  settings: SettingsConfig
  defaults: T
}) {
  blockRegistry.register({
    ...config,
    template: { component: config.component }
  })
}
```

### 4.2 Block Definitions
Centralize block definitions:

```typescript
// src/lib/blocks/definitions/hero.definition.ts
import { HeroComponent } from '@/components/blocks/layout/hero'
import { heroSchema } from '../schemas/hero.schema'
import { heroSettingsConfig } from '../configs/hero.config'
import { heroDefaults } from '../defaults/hero.defaults'

registerBlock({
  id: 'hero',
  name: 'Hero Section',
  category: 'layout',
  component: HeroComponent,
  schema: heroSchema,
  settings: heroSettingsConfig,
  defaults: heroDefaults
})
```

## Phase 5: Developer Experience

### 5.1 Block Generator CLI
Create script to scaffold new blocks:

```bash
npm run generate:block -- --name "pricing-table" --category "commerce"
```

Generates complete block structure with:
- Component files
- Schema definition
- Settings configuration  
- Default data
- Tests
- Registration

### 5.2 Type Safety Improvements
Enhanced type inference:

```typescript
// Automatic type inference from schema
export function createBlock<T extends ZodSchema>(
  schema: T,
  component: ComponentType<z.infer<T>>
): BlockDefinition<z.infer<T>> {
  // Implementation
}
```

### 5.3 Bundle Analysis
- Individual block chunks for code splitting
- Lazy loading of block components
- Tree-shakeable exports

## Migration Strategy

### Step 1: Create New Structure (Non-breaking)
- Add new directories alongside existing code
- Create new schema/config files
- No changes to existing imports

### Step 2: Gradual Migration
- Move blocks one category at a time
- Update imports incrementally  
- Add deprecation warnings to old imports

### Step 3: Clean Up
- Remove old monolithic files
- Update all import paths
- Remove deprecation warnings

### Step 4: Optimization
- Add bundle splitting
- Implement lazy loading
- Performance monitoring

## Benefits

1. **Maintainability**: Easier to find, modify, and test individual blocks
2. **Scalability**: Clear patterns for adding new blocks
3. **Performance**: Better code splitting and tree-shaking
4. **Developer Experience**: Consistent structure, better tooling
5. **Team Collaboration**: Reduced merge conflicts, clearer ownership
6. **Testing**: Isolated unit tests per block
7. **Documentation**: Co-located documentation and examples

## Estimated Timeline

- **Phase 1-2**: 2-3 days (Core restructuring)
- **Phase 3**: 1-2 days (Config management) 
- **Phase 4**: 1 day (Registry improvements)
- **Phase 5**: 2-3 days (DX improvements)

**Total**: ~1.5 weeks for complete refactor

## Risk Mitigation

- Feature flag new structure during migration
- Comprehensive test coverage before changes
- Gradual rollout with easy rollback plan
- Documentation updates with each phase