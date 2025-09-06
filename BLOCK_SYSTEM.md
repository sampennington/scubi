# Block System

The Scubi block system provides a flexible, type-safe way to create reusable content components for dive shop websites.

## Architecture

### Core Components

- **Block Registry** (`src/lib/blocks/registry.ts`) - Central registry of all available blocks
- **Block Configuration** (`src/lib/blocks/config-types.ts`) - TypeScript types for block definitions
- **Dynamic Settings** (`src/components/blocks/dynamic-settings/`) - Auto-generated settings panels
- **Block Components** (`src/components/blocks/`) - Individual block implementations

### Block Structure

Each block consists of:
- **Schema**: Zod validation schema for block content
- **Settings**: Configuration for the settings panel UI
- **Component**: React component for rendering
- **Preview**: Optional preview configuration

## Development Guidelines

### Schema Best Practices

- **No Defaults in Schemas**: Zod schemas should NOT include `.default()` values. Default values belong in the separate `.default.ts` file
- **Schema Purpose**: Block schemas define the shape and validation only, default values are handled separately in the block structure
- **Type Safety**: Use proper Zod validation for runtime type checking and TypeScript inference

### File Structure

Each block should follow the established pattern:
- `block-name.schema.ts` - Zod validation schema (no defaults)
- `block-name.default.ts` - Default content values
- `block-name.config.ts` - Settings panel configuration
- `block-name.component.tsx` - React component
- `block-name.definition.ts` - Block definition for registry
- `index.ts` - Exports

## Adding a New Block

### 1. Create the Block Component

```typescript
// src/components/blocks/my-block/index.tsx
export interface MyBlockData {
  title: string
  description: string
  items: string[]
}

export function MyBlock({ title, description, items }: MyBlockData) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 2. Define the Block Schema

```typescript
// src/lib/blocks/schemas/my-block.ts
import { z } from "zod"

export const myBlockSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  items: z.array(z.string()).min(1, "At least one item is required")
})

export type MyBlockData = z.infer<typeof myBlockSchema>
```

### 3. Create Settings Configuration

```typescript
// src/lib/blocks/configs/my-block.ts
import type { SettingsConfig } from "../config-types"

export const myBlockSettings: SettingsConfig = {
  sections: [
    {
      id: "content",
      title: "Content",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          required: true,
          defaultValue: "My Block Title"
        },
        {
          name: "description", 
          label: "Description",
          type: "textarea",
          rows: 3
        },
        {
          name: "items",
          label: "Items",
          type: "array",
          itemSchema: {
            name: "item",
            label: "Item",
            type: "text",
            defaultValue: ""
          },
          addButtonText: "Add Item"
        }
      ]
    }
  ]
}
```

### 4. Register the Block

```typescript
// src/lib/blocks/registry.ts
import { MyBlock } from "@/components/blocks/my-block"
import { myBlockSchema } from "./schemas/my-block"
import { myBlockSettings } from "./configs/my-block"

export const blockRegistry = new Map([
  // ... existing blocks
  ["my-block", {
    id: "my-block",
    name: "My Block",
    description: "A custom block for displaying lists",
    category: "content",
    schema: myBlockSchema,
    settings: myBlockSettings,
    template: {
      component: MyBlock
    }
  }]
])
```

## Field Types

The dynamic settings system supports various field types:

- `text`, `email`, `url` - Text inputs
- `textarea` - Multi-line text
- `number`, `range` - Numeric inputs  
- `select` - Dropdown selection
- `toggle` - Boolean switch
- `color` - Color picker
- `image` - Image upload
- `object` - Nested field groups
- `array` - Dynamic lists

## Validation

All block data is validated using Zod schemas, providing:
- Runtime type safety
- Form validation
- TypeScript inference
- Error messages

## Conditional Fields

Fields can be shown/hidden based on other field values:

```typescript
{
  name: "buttonUrl",
  label: "Button URL", 
  type: "url",
  conditions: [
    {
      field: "showButton",
      operator: "equals",
      value: true
    }
  ]
}
```