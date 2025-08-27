"use client"
import { Nav } from "./nav"
import { Footer } from "./footer"
import { BlockRenderer } from "@/components/blocks/shared/block-renderer"
import { ThemeProvider } from "@/components/blocks/shared/theme-provider"
import { Favicon } from "@/components/ui/favicon"

import { ThemeProvider as NextThemeProvider } from "next-themes"

export const DiveShopSite = () => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme="light"
    >
      <Favicon />
      <ThemeProvider>
        <div className="flex min-h-screen flex-col bg-background">
          {/* <Nav /> */}
          <main className="flex-1">
            <BlockRenderer />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </NextThemeProvider>
  )
}

export default DiveShopSite
