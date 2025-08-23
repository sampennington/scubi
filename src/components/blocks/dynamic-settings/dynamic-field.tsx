"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/ui/color-picker"
import { UploadButton } from "@/components/ui/upload-button"
import { Plus, Trash2 } from "lucide-react"
import type { FieldConfig } from "@/lib/blocks/config-types"

interface DynamicFieldProps {
  config: FieldConfig
  value: any
  onChange: (value: any) => void
  error?: string
  touched?: boolean
}

export function DynamicField({ config, value, onChange, error, touched }: DynamicFieldProps) {
  const hasError = error && touched

  switch (config.type) {
    case "text":
      return (
        <div className="space-y-1">
          <Input
            type={config.type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )
    case "email":
      return (
        <div className="space-y-1">
          <Input
            type={config.type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )
    case "url":
      return (
        <div className="space-y-1">
          <Input
            type={config.type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    case "textarea":
      return (
        <div className="space-y-1">
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            rows={config.rows || 3}
            maxLength={config.maxLength}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "number":
      return (
        <div className="space-y-1">
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            min={config.min}
            max={config.max}
            step={config.step}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "range":
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <input
              type="range"
              value={value || config.min}
              onChange={(e) => onChange(Number(e.target.value))}
              min={config.min}
              max={config.max}
              step={config.step || 1}
              className="flex-1"
            />
            <span className="w-12 text-center font-medium text-sm">{value || config.min}</span>
          </div>
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    case "select":
      return (
        <div className="space-y-1">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {config.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    case "toggle":
      return (
        <div className="space-y-1">
          <Switch checked={value || false} onCheckedChange={onChange} />
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    case "color":
      return (
        <div className="space-y-1">
          <ColorPicker value={value || "#000000"} onChange={onChange} />
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    case "image":
      return (
        <div className="space-y-1">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                onChange(res[0].url)
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error)
            }}
          />
          {value && (
            <div className="mt-2">
              <img src={value} alt="Preview" className="w-20 h-20 object-cover rounded border" />
            </div>
          )}
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    case "object":
      return (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          {config.fields.map((subField) => (
            <div key={subField.name} className="space-y-2">
              <label className="font-medium text-sm">{subField.label}</label>
              <DynamicField
                config={subField}
                value={value?.[subField.name]}
                onChange={(subValue) => onChange({ ...value, [subField.name]: subValue })}
              />
            </div>
          ))}
          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    case "array":
      const arrayValue = value || []

      return (
        <div className="space-y-3">
          {arrayValue.map((item: any, index: number) => (
            <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
              <div className="flex-1">
                <DynamicField
                  config={config.itemSchema}
                  value={item}
                  onChange={(newItem) => {
                    const newArray = [...arrayValue]
                    newArray[index] = newItem
                    onChange(newArray)
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newArray = arrayValue.filter((_: any, i: number) => i !== index)
                  onChange(newArray)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onChange([...arrayValue, config.itemSchema.defaultValue || ""])
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {config.addButtonText || "Add Item"}
          </Button>

          {hasError && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )

    default:
      return (
        <div className="text-muted-foreground text-sm">
          Unsupported field type: {(config as any).type}
        </div>
      )
  }
}
