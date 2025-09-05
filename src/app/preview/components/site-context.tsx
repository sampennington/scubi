"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { Block, NavigationItem, Page } from "@/lib/api"
import type { SiteSettings } from "@/lib/api/types"
import { getBlocks } from "@/lib/actions/blocks"
import { getSiteSettings } from "@/lib/actions/site-settings"

export interface SiteContextValue {
  shopId: string
  isEditMode: boolean
  setEditMode: (enabled: boolean) => void
  previewDimension: "mobile" | "tablet" | "desktop"
  setPreviewDimension: (dimension: "mobile" | "tablet" | "desktop") => void
  currentPage: Page
  pages: NavigationItem[]
  blocks: Block[]
  setBlocks: (blocks: Block[]) => void
  siteSettings: SiteSettings
  currentPath: string
  isShopOwner: boolean
  publishSite: () => void
  refreshBlocks: () => Promise<void>
  refreshSiteSettings?: () => Promise<void>
  isLoadingLocalBlocks: boolean
  blockSettingsActive: string | null | undefined
  setBlockSettingsActive: (id: string) => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

interface TemplateProviderProps {
  children: ReactNode
  shopId: string
  siteSettings: SiteSettings
  pages: NavigationItem[]
  currentPage: Page
  currentPath: string
  isShopOwner: boolean
}

export function TemplateProvider({
  children,
  shopId,
  siteSettings: initialSiteSettings,
  pages,
  currentPage,
  currentPath,
  isShopOwner
}: TemplateProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [blockSettingsActive, setBlockSettingsActive] = useState<string | null>()
  const [isLoadingLocalBlocks, setIsLoadingLocalBlocks] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [previewDimension, setPreviewDimension] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  )

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const editMode = searchParams.get("edit") === "true"
    setIsEditMode(editMode)
  }, [])

  const fetchBlocks = useCallback(async (pageId: string) => {
    setIsLoadingLocalBlocks(true)
    const { blocks } = await getBlocks(pageId)

    if (blocks) {
      setBlocks(blocks)
    }
    setIsLoadingLocalBlocks(false)
  }, [])

  const fetchSiteSettings = useCallback(async () => {
    const { settings } = await getSiteSettings(shopId)
    if (settings) {
      setSiteSettings(settings)
    }
  }, [shopId])

  useEffect(() => {
    fetchBlocks(currentPage.id)
  }, [currentPage.id, fetchBlocks])

  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled)

    // Update URL without navigation
    const newUrl = new URL(window.location.href)
    if (enabled) {
      newUrl.searchParams.set("edit", "true")
    } else {
      newUrl.searchParams.set("edit", "false")
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
        setBlocks,
        pages,
        currentPage,
        currentPath,
        isShopOwner,
        publishSite: () => null,
        refreshBlocks: () => fetchBlocks(currentPage.id),
        refreshSiteSettings: fetchSiteSettings,
        isLoadingLocalBlocks,
        blockSettingsActive,
        setBlockSettingsActive
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
