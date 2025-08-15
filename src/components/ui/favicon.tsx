"use client"

import { useEffect } from "react"
import { useSite } from "../site-context"

export const Favicon = () => {
  const { siteSettings } = useSite()
  const faviconUrl = siteSettings.faviconUrl || ""

  useEffect(() => {
    if (faviconUrl) {
      const existingLinks = document.querySelectorAll('link[rel*="icon"]')
      existingLinks.forEach((link) => link.remove())

      const link = document.createElement("link")
      link.rel = "icon"
      link.type = "image/x-icon"
      link.href = faviconUrl
      document.head.appendChild(link)

      const sizes = [16, 32, 48]
      sizes.forEach((size) => {
        const sizeLink = document.createElement("link")
        sizeLink.rel = "icon"
        sizeLink.type = "image/png"
        sizeLink.sizes = `${size}x${size}`
        sizeLink.href = faviconUrl
        document.head.appendChild(sizeLink)
      })
    }
  }, [faviconUrl])

  return null
}
