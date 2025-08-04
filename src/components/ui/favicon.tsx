"use client"

import { useEffect } from "react"

interface FaviconProps {
  faviconUrl?: string
  siteName?: string
}

export const Favicon = ({ faviconUrl, siteName }: FaviconProps) => {
  useEffect(() => {
    if (faviconUrl) {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll('link[rel*="icon"]')
      existingLinks.forEach((link) => link.remove())

      // Add new favicon link
      const link = document.createElement("link")
      link.rel = "icon"
      link.type = "image/x-icon"
      link.href = faviconUrl
      document.head.appendChild(link)

      // Also add for different sizes
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
