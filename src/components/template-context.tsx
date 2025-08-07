"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Block, NavigationItem, Page } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/types"

export interface TemplateContextValue {
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
}

const TemplateContext = createContext<TemplateContextValue | null>(null)

interface TemplateProviderProps {
  children: ReactNode
  value: TemplateContextValue
}

export function TemplateProvider({ children, value }: TemplateProviderProps) {
  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const context = useContext(TemplateContext)
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider")
  }
  return context
}

// Convenience hooks for specific values
export function useShopOwner() {
  const { isShopOwner } = useTemplate()
  return isShopOwner
}

export function useEditMode() {
  const { isEditMode } = useTemplate()
  return isEditMode
}

export function useSiteSettings() {
  const { siteSettings } = useTemplate()
  return siteSettings
}

export function useCurrentPage() {
  const { currentPage } = useTemplate()
  return currentPage
}

export function useNavigation() {
  const { pages, currentPath, isHome } = useTemplate()
  return { pages, currentPath, isHome }
}

export function useBlocks() {
  const { blocks } = useTemplate()
  return blocks
}

export function useShopId() {
  const { shopId } = useTemplate()
  return shopId
}

// Client-side utility functions for page lookups
export function usePageLookup() {
  const { pages } = useTemplate()

  const getPageBySlug = (slug: string) =>
    pages.find((page) => page.slug === slug)
  const getPageById = (id: string) => pages.find((page) => page.id === id)

  return { getPageBySlug, getPageById }
}
