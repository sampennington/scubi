"use client"

import { useEffect } from "react"

type Theme = {
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

interface ThemeProviderProps {
  children: React.ReactNode
  theme: Theme
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const { primaryColor, secondaryColor, accentColor } = theme

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--primary", primaryColor)
    root.style.setProperty("--secondary", secondaryColor)
    root.style.setProperty("--accent", accentColor)
  }, [primaryColor, secondaryColor, accentColor])

  return <>{children}</>
}
