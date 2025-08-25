"use client"

import { useEffect } from "react"
import { useSite } from "../../../app/preview/components/site-context"

interface ThemeProviderProps {
  children: React.ReactNode
}

// Font loading utility
const loadGoogleFont = (fontFamily: string) => {
  if (!fontFamily || fontFamily === "system-ui") return

  // Check if font is already loaded
  const existingLink = document.querySelector(`link[href*="${fontFamily.replace(" ", "+")}"]`)
  if (existingLink) return

  const link = document.createElement("link")
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@400;700&display=swap`
  link.rel = "stylesheet"
  document.head.appendChild(link)
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { siteSettings } = useSite()
  const { primaryColor, secondaryColor, accentColor, fontFamilyHeading, fontFamilyBody } =
    siteSettings

  // Load fonts when theme changes
  useEffect(() => {
    if (fontFamilyHeading) {
      loadGoogleFont(fontFamilyHeading)
    }
    if (fontFamilyBody) {
      loadGoogleFont(fontFamilyBody)
    }
  }, [fontFamilyHeading, fontFamilyBody])

  const getFontStyle = (fontFamily: string) => {
    if (!fontFamily || fontFamily === "system-ui") {
      return "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    }
    return `"${fontFamily}", system-ui, sans-serif`
  }

  return (
    <div
      className="site-preview"
      style={
        {
          "--primary": primaryColor,
          "--secondary": secondaryColor,
          "--accent": accentColor,
          // "--cta": ctaColor || primaryColor,
          "--font-heading": getFontStyle(fontFamilyHeading || "Inter"),
          "--font-body": getFontStyle(fontFamilyBody || "Inter")
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
