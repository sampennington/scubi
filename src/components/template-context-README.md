# Template Context

A React context system for easy access to commonly used template variables and functions.

## Overview

The template context provides centralized access to:
- Shop ownership and permissions
- Current page and navigation data
- Site settings and configuration
- Block data and utilities
- Edit mode status

## Usage

### 1. Wrap your template with TemplateProvider

```tsx
import { TemplateProvider } from "@/components/template-context"

export default function PreviewPage({ params }) {
  // ... fetch data ...
  
  const templateContextValue = {
    shopId,
    isShopOwner,
    isEditMode,
    currentPage,
    pages,
    blocks,
    siteSettings,
    currentPath,
    isHome,
    getPageBySlug,
    getPageById
  }

  return (
    <TemplateProvider value={templateContextValue}>
      <YourTemplate />
    </TemplateProvider>
  )
}
```

### 2. Use the hooks in your components

```tsx
import { useShopOwner, useEditMode, useSiteSettings } from "@/components/template-context"

export function MyComponent() {
  const isShopOwner = useShopOwner()
  const isEditMode = useEditMode()
  const siteSettings = useSiteSettings()

  return (
    <div>
      {isShopOwner && isEditMode && (
        <div className="admin-panel">
          Edit this page
        </div>
      )}
      <h1>{siteSettings.name}</h1>
    </div>
  )
}
```

## Available Hooks

### Main Hook
- `useTemplate()` - Get the entire context object

### Specific Hooks
- `useShopOwner()` - Returns `boolean`
- `useEditMode()` - Returns `boolean`
- `useSiteSettings()` - Returns `SiteSettings`
- `useCurrentPage()` - Returns `Page`
- `useNavigation()` - Returns `{ pages, currentPath, isHome }`
- `useBlocks()` - Returns `Block[]`
- `useShopId()` - Returns `string`

## Context Value Interface

```tsx
interface TemplateContextValue {
  // Shop and ownership
  shopId: string
  isShopOwner: boolean
  isEditMode: boolean
  
  // Current page data
  currentPage: Page
  pages: NavigationItem[]
  blocks: Block[]
  siteSettings: SiteSettings
  
  // Navigation helpers
  currentPath: string
  isHome: boolean
  
  // Utility functions
  getPageBySlug: (slug: string) => NavigationItem | undefined
  getPageById: (id: string) => NavigationItem | undefined
}
```

## Examples

### Conditional Admin UI
```tsx
function AdminPanel() {
  const isShopOwner = useShopOwner()
  const isEditMode = useEditMode()
  
  if (!isShopOwner || !isEditMode) return null
  
  return <div>Admin controls here</div>
}
```

### Using Site Settings
```tsx
function ContactInfo() {
  const siteSettings = useSiteSettings()
  
  return (
    <div>
      <h2>{siteSettings.name}</h2>
      <p>{siteSettings.email}</p>
      <p>{siteSettings.phoneNumber}</p>
    </div>
  )
}
```

### Navigation Helpers
```tsx
function Navigation() {
  const { pages, currentPath, isHome } = useNavigation()
  
  return (
    <nav>
      {pages.map(page => (
        <Link 
          key={page.id} 
          href={page.slug}
          className={currentPath === page.slug ? 'active' : ''}
        >
          {page.title}
        </Link>
      ))}
    </nav>
  )
}
```

## Best Practices

1. **Use specific hooks** when you only need one value
2. **Use the main hook** when you need multiple values
3. **Always check for context** - the hooks will throw if used outside TemplateProvider
4. **Keep components focused** - don't pass the entire context down props

## Error Handling

The hooks will throw an error if used outside of a `TemplateProvider`:

```tsx
// ❌ This will throw an error
function MyComponent() {
  const isShopOwner = useShopOwner() // Error: useShopOwner must be used within a TemplateProvider
  return <div>...</div>
}

// ✅ This works
function MyComponent() {
  return (
    <TemplateProvider value={contextValue}>
      <InnerComponent />
    </TemplateProvider>
  )
}

function InnerComponent() {
  const isShopOwner = useShopOwner() // ✅ Works
  return <div>...</div>
}
``` 