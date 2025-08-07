"use client"
import { Nav } from "./nav"
import { Footer } from "./footer"
import type { Block, NavigationItem, Page } from "../lib/api"
import { BlockRenderer } from "@/components/blocks/block-renderer"
import type { SiteSettings } from "@/lib/api/types"
import { ThemeProvider } from "@/components/blocks/theme-provider"
import { Favicon } from "@/components/ui/favicon"

import { ThemeProvider as NextThemeProvider } from "next-themes"

type User = {
  isShopOwner: boolean
}

export const DiveShopSite = ({
  pages,
  siteSettings,
  blocks
}: {
  currentPage: Page
  pages: NavigationItem[]
  siteSettings: SiteSettings
  blocks: Block[]
}) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme="light"
    >
      <Favicon
        faviconUrl={siteSettings.faviconUrl || undefined}
        siteName={siteSettings.name}
      />
      <ThemeProvider
        theme={{
          primaryColor: siteSettings.primaryColor || "#3b82f6",
          secondaryColor: siteSettings.secondaryColor || "#64748b",
          accentColor: siteSettings.accentColor || "#f59e0b",
          fontFamilyHeading: siteSettings.fontFamilyHeading || undefined,
          fontFamilyBody: siteSettings.fontFamilyBody || undefined
        }}
      >
        <div className="flex min-h-screen flex-col bg-background">
          <Nav siteSettings={siteSettings} pages={pages} />

          <main className="flex-1">
            <BlockRenderer blocks={blocks} />
          </main>

          <Footer siteSettings={siteSettings} />
        </div>
      </ThemeProvider>
    </NextThemeProvider>
  )
}

export default DiveShopSite
