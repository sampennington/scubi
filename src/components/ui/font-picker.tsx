"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export const fontOptions = [
  {
    value: "Inter",
    label: "Inter",
    category: "Modern",
    description: "Clean and modern sans-serif"
  },
  {
    value: "Roboto",
    label: "Roboto",
    category: "Modern",
    description: "Google's signature font"
  },
  {
    value: "Open Sans",
    label: "Open Sans",
    category: "Modern",
    description: "Highly readable sans-serif"
  },
  {
    value: "Lato",
    label: "Lato",
    category: "Friendly",
    description: "Warm and friendly"
  },
  {
    value: "Poppins",
    label: "Poppins",
    category: "Modern",
    description: "Geometric sans-serif"
  },
  {
    value: "Montserrat",
    label: "Montserrat",
    category: "Bold",
    description: "Strong and bold"
  },
  {
    value: "Playfair Display",
    label: "Playfair Display",
    category: "Elegant",
    description: "Elegant serif font"
  },
  {
    value: "Merriweather",
    label: "Merriweather",
    category: "Elegant",
    description: "Beautiful serif font"
  },
  {
    value: "Source Sans Pro",
    label: "Source Sans Pro",
    category: "Professional",
    description: "Professional and clean"
  },
  {
    value: "Nunito",
    label: "Nunito",
    category: "Friendly",
    description: "Rounded and friendly"
  },
  {
    value: "Raleway",
    label: "Raleway",
    category: "Modern",
    description: "Elegant and thin"
  },
  {
    value: "system-ui",
    label: "System Default",
    category: "System",
    description: "Your device's default font"
  }
]

interface FontPickerProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FontPicker({
  value,
  onValueChange,
  placeholder = "Select a font...",
  className
}: FontPickerProps) {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())

  // Load Google Fonts dynamically
  useEffect(() => {
    const loadFont = (fontFamily: string) => {
      if (fontFamily === "system-ui" || loadedFonts.has(fontFamily)) return

      const link = document.createElement("link")
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@400;700&display=swap`
      link.rel = "stylesheet"
      document.head.appendChild(link)

      setLoadedFonts((prev) => new Set([...prev, fontFamily]))
    }

    if (value && value !== "system-ui") {
      loadFont(value)
    }

    ;["Inter", "Roboto", "Open Sans"].forEach(loadFont)
  }, [value, loadedFonts])

  const getFontStyle = (fontFamily: string) => {
    if (fontFamily === "system-ui") {
      return {
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      }
    }
    return { fontFamily: `"${fontFamily}", system-ui, sans-serif` }
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder}>
          {value && (
            <span style={getFontStyle(value)}>
              {fontOptions.find((f) => f.value === value)?.label || value}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {fontOptions.map((font) => (
          <SelectItem key={font.value} value={font.value}>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium" style={getFontStyle(font.value)}>
                  {font.label}
                </span>
                <span className="text-muted-foreground text-xs">{font.description}</span>
              </div>
              {value === font.value && <Check className="ml-2 h-4 w-4" />}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
