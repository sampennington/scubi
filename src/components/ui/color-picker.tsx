"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Palette } from "lucide-react"
import BaseColorPicker, { type Color } from "@rc-component/color-picker"
import "@rc-component/color-picker/assets/index.css"

interface ColorPickerProps {
  color?: string
  onChange?: (color: string) => void
  className?: string
  placeholder?: string
}

export function ColorPicker({
  color = "#000000",
  onChange,
  className,
  placeholder = "Pick a color"
}: ColorPickerProps) {
  const handleChange = (newColor: Color) => {
    onChange?.(newColor.toHexString())
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !color && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border" style={{ backgroundColor: color }} />
            <span>{color || placeholder}</span>
            <Palette className="ml-auto h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <BaseColorPicker value={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  )
}
