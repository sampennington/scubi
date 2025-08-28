"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PaletteIcon, TypeIcon, LayoutIcon, SaveIcon } from "lucide-react"
import { useSite } from "@/app/preview/components/site-context"
import { updateSiteSettings } from "@/lib/actions/site-settings"
import { toast } from "sonner"
import type { SiteSettings } from "@/lib/api/types"

interface ThemeEditorModalProps {
  isOpen: boolean
  onClose: () => void
}

const GOOGLE_FONTS = [
  { name: "Inter", value: "Inter" },
  { name: "Roboto", value: "Roboto" },
  { name: "Open Sans", value: "Open Sans" },
  { name: "Lato", value: "Lato" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Source Sans Pro", value: "Source Sans Pro" },
  { name: "Oswald", value: "Oswald" },
  { name: "Raleway", value: "Raleway" },
  { name: "PT Sans", value: "PT Sans" },
  { name: "Merriweather", value: "Merriweather" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Poppins", value: "Poppins" },
  { name: "System Default", value: "system-ui" }
]

const PRESET_COLORS = [
  { name: "Blue", primary: "#3b82f6", secondary: "#64748b", accent: "#06b6d4" },
  { name: "Green", primary: "#10b981", secondary: "#6b7280", accent: "#f59e0b" },
  { name: "Purple", primary: "#8b5cf6", secondary: "#6b7280", accent: "#ec4899" },
  { name: "Orange", primary: "#f97316", secondary: "#64748b", accent: "#06b6d4" },
  { name: "Red", primary: "#ef4444", secondary: "#6b7280", accent: "#10b981" },
  { name: "Teal", primary: "#14b8a6", secondary: "#64748b", accent: "#f59e0b" }
]

const loadGoogleFont = (fontFamily: string) => {
  if (!fontFamily || fontFamily === "system-ui") return

  const existingLink = document.querySelector(`link[href*="${fontFamily.replace(" ", "+")}"]`)
  if (existingLink) return

  const link = document.createElement("link")
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@400;600;700&display=swap`
  link.rel = "stylesheet"
  document.head.appendChild(link)
}

const getFontFamilyStyle = (fontFamily: string) => {
  if (!fontFamily || fontFamily === "system-ui") {
    return "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  }
  return `"${fontFamily}", system-ui, sans-serif`
}

export function ThemeEditorModal({ isOpen, onClose }: ThemeEditorModalProps) {
  const { siteSettings, shopId, refreshSiteSettings } = useSite()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<SiteSettings>>(siteSettings)

  useEffect(() => {
    if (formData.fontFamilyHeading) {
      loadGoogleFont(formData.fontFamilyHeading)
    }
    if (formData.fontFamilyBody) {
      loadGoogleFont(formData.fontFamilyBody)
    }
  }, [formData.fontFamilyHeading, formData.fontFamilyBody])

  useEffect(() => {
    if (isOpen) {
      loadGoogleFont(formData.fontFamilyHeading || "Inter")
      loadGoogleFont(formData.fontFamilyBody || "Inter")
    }
  }, [isOpen, formData.fontFamilyHeading, formData.fontFamilyBody])

  const handleFieldChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "fontFamilyHeading" || field === "fontFamilyBody") {
      loadGoogleFont(value)
    }
  }

  const applyColorPreset = (preset: (typeof PRESET_COLORS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateSiteSettings(shopId, formData)
      if (result.success) {
        await refreshSiteSettings?.()
        toast.success("Theme updated successfully!")
        onClose()
      } else {
        toast.error("Failed to update theme")
      }
    } catch (e) {
      console.warn(e)
      toast.error("Failed to update theme")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PaletteIcon className="h-5 w-5" />
            Theme Editor
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <LayoutIcon className="h-4 w-4" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Color Presets</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {PRESET_COLORS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    onClick={() => applyColorPreset(preset)}
                    className="h-20 flex-col gap-2 p-4"
                  >
                    <div className="flex gap-1">
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: preset.secondary }}
                      />
                      <div className="h-4 w-4 rounded" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Custom Colors</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor || "#3b82f6"}
                      onChange={(e) => handleFieldChange("primaryColor", e.target.value)}
                      className="h-10 w-12 p-1"
                    />
                    <Input
                      value={formData.primaryColor || "#3b82f6"}
                      onChange={(e) => handleFieldChange("primaryColor", e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor || "#64748b"}
                      onChange={(e) => handleFieldChange("secondaryColor", e.target.value)}
                      className="h-10 w-12 p-1"
                    />
                    <Input
                      value={formData.secondaryColor || "#64748b"}
                      onChange={(e) => handleFieldChange("secondaryColor", e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.accentColor || "#06b6d4"}
                      onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                      className="h-10 w-12 p-1"
                    />
                    <Input
                      value={formData.accentColor || "#06b6d4"}
                      onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Font Families</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="headingFont">Heading Font</Label>
                  <Select
                    value={formData.fontFamilyHeading || "Inter"}
                    onValueChange={(value) => handleFieldChange("fontFamilyHeading", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select heading font" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFont">Body Font</Label>
                  <Select
                    value={formData.fontFamilyBody || "Inter"}
                    onValueChange={(value) => handleFieldChange("fontFamilyBody", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select body font" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Font Preview</h3>
              <div className="space-y-4 rounded-lg border p-6">
                <h1
                  className="font-bold text-3xl"
                  style={{
                    fontFamily: getFontFamilyStyle(formData.fontFamilyHeading || "Inter"),
                    color: formData.primaryColor || "#3b82f6"
                  }}
                >
                  Heading Example
                </h1>
                <p
                  className="text-base"
                  style={{
                    fontFamily: getFontFamilyStyle(formData.fontFamilyBody || "Inter"),
                    color: formData.secondaryColor || "#64748b"
                  }}
                >
                  This is an example of body text using your selected fonts and colors. It gives you
                  a preview of how your content will look on your website.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Button Styles</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buttonSize">Button Size</Label>
                  <Select
                    value={formData.buttonSize || "md"}
                    onValueChange={(value) => handleFieldChange("buttonSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select button size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonBorderRadius">Border Radius</Label>
                  <Select
                    value={formData.buttonBorderRadius || "md"}
                    onValueChange={(value) => handleFieldChange("buttonBorderRadius", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select border radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryButtonStyle">Primary Button Style</Label>
                  <Select
                    value={formData.primaryButtonStyle || "solid"}
                    onValueChange={(value) => handleFieldChange("primaryButtonStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryButtonStyle">Secondary Button Style</Label>
                  <Select
                    value={formData.secondaryButtonStyle || "outline"}
                    onValueChange={(value) => handleFieldChange("secondaryButtonStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select secondary style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Button Preview</h3>
              <div className="space-y-4 rounded-lg border p-6">
                <div className="flex flex-wrap gap-4">
                  <Button
                    className={`${
                      formData.buttonSize === "sm"
                        ? "h-8 px-3 text-xs"
                        : formData.buttonSize === "lg"
                          ? "h-12 px-8"
                          : "h-10 px-4 py-2"
                    } ${
                      formData.buttonBorderRadius === "none"
                        ? "rounded-none"
                        : formData.buttonBorderRadius === "sm"
                          ? "rounded-sm"
                          : formData.buttonBorderRadius === "lg"
                            ? "rounded-lg"
                            : formData.buttonBorderRadius === "full"
                              ? "rounded-full"
                              : "rounded-md"
                    }`}
                    variant={
                      formData.primaryButtonStyle === "outline"
                        ? "outline"
                        : formData.primaryButtonStyle === "ghost"
                          ? "ghost"
                          : "default"
                    }
                    style={{
                      backgroundColor:
                        formData.primaryButtonStyle === "solid"
                          ? formData.primaryColor || "#3b82f6"
                          : "transparent",
                      borderColor:
                        formData.primaryButtonStyle === "outline"
                          ? formData.primaryColor || "#3b82f6"
                          : "transparent",
                      color:
                        formData.primaryButtonStyle === "solid"
                          ? "#ffffff"
                          : formData.primaryColor || "#3b82f6"
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    className={`${
                      formData.buttonSize === "sm"
                        ? "h-8 px-3 text-xs"
                        : formData.buttonSize === "lg"
                          ? "h-12 px-8"
                          : "h-10 px-4 py-2"
                    } ${
                      formData.buttonBorderRadius === "none"
                        ? "rounded-none"
                        : formData.buttonBorderRadius === "sm"
                          ? "rounded-sm"
                          : formData.buttonBorderRadius === "lg"
                            ? "rounded-lg"
                            : formData.buttonBorderRadius === "full"
                              ? "rounded-full"
                              : "rounded-md"
                    }`}
                    variant={
                      formData.secondaryButtonStyle === "outline"
                        ? "outline"
                        : formData.secondaryButtonStyle === "ghost"
                          ? "ghost"
                          : "default"
                    }
                    style={{
                      backgroundColor:
                        formData.secondaryButtonStyle === "solid"
                          ? formData.secondaryColor || "#64748b"
                          : "transparent",
                      borderColor:
                        formData.secondaryButtonStyle === "outline"
                          ? formData.secondaryColor || "#64748b"
                          : "transparent",
                      color:
                        formData.secondaryButtonStyle === "solid"
                          ? "#ffffff"
                          : formData.secondaryColor || "#64748b"
                    }}
                  >
                    Secondary Button
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  These buttons will use your selected size, border radius, and styles throughout
                  your site.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <SaveIcon className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
