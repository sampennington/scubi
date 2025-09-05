"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface HtmlContentProps {
  content: string
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function HtmlContent({ content, className, as = "div" }: HtmlContentProps) {
  const isHtml = content.includes("<")

  if (!isHtml) {
    return React.createElement(as, { className }, content)
  }

  return React.createElement(as, {
    className: cn("prose prose-sm max-w-none", className),
    dangerouslySetInnerHTML: { __html: content }
  })
}
