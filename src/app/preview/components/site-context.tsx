"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Block, NavigationItem, Page } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/types"

export interface SiteContextValue {
  shopId: string
  isEditMode: boolean
  setEditMode: (enabled: boolean) => void
  previewDimension: "mobile" | "tablet" | "desktop"
  setPreviewDimension: (dimension: "mobile" | "tablet" | "desktop") => void
  currentPage: Page
  pages: NavigationItem[]
  blocks: Block[]
  siteSettings: SiteSettings
  currentPath: string
  isShopOwner: boolean
  publishSite: () => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

interface TemplateProviderProps {
  children: ReactNode
  shopId: string
  siteSettings: SiteSettings
  blocks: Block[]
  pages: NavigationItem[]
  currentPage: Page
  currentPath: string
  isShopOwner: boolean
}

export function TemplateProvider({
  children,
  shopId,
  siteSettings,
  blocks,
  pages,
  currentPage,
  currentPath,
  isShopOwner
}: TemplateProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [previewDimension, setPreviewDimension] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  )

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const editMode = searchParams.get("edit") === "true"
    setIsEditMode(editMode)
  }, [])

  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled)

    // Update URL without navigation
    const newUrl = new URL(window.location.href)
    if (enabled) {
      newUrl.searchParams.set("edit", "true")
    } else {
      newUrl.searchParams.delete("edit")
    }
    window.history.replaceState({}, "", newUrl.toString())
  }

  return (
    <SiteContext.Provider
      value={{
        shopId,
        isEditMode,
        setEditMode,
        previewDimension,
        setPreviewDimension,
        siteSettings,
        blocks,
        pages,
        currentPage,
        currentPath,
        isShopOwner,
        publishSite: () => null
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error("useSite must be used within a TemplateProvider")
  }
  return context
}

export function usePageLookup() {
  const { pages } = useSite()

  const getPageBySlug = (slug: string) => pages.find((page) => page.slug === slug)
  const getPageById = (id: string) => pages.find((page) => page.id === id)

  return { getPageBySlug, getPageById }
}
