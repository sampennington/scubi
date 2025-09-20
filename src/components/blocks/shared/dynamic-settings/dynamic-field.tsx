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
import { Plus, Trash2 } from "lucide-react"
import type { FieldConfig } from "@/lib/blocks/core/config-types"
import { EditableImage } from "../../editable/editable-image"
import { Loader2 } from "lucide-react"

type FieldValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>
  | Record<string, unknown>[]
  | null
  | undefined

interface DynamicFieldProps {
  config: FieldConfig
  value: FieldValue
  onChange: (value: FieldValue) => void
  error?: string
  touched?: boolean
  onAction?: (action: string) => void
}

export function DynamicField({ config, value, onChange, error, touched, onAction }: DynamicFieldProps) {
  const hasError = error && touched

  switch (config.type) {
    case "text":
      return (
        <div className="space-y-1">
          <Input
            type={config.type}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )
    case "email":
      return (
        <div className="space-y-1">
          <Input
            type={config.type}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )
    case "url":
      return (
        <div className="space-y-1">
          <Input
            type={config.type}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "textarea":
      return (
        <div className="space-y-1">
          <Textarea
            value={(value as string) || ""}
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
            value={(value as number)?.toString() || ""}
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
              value={(value as number) || config.min}
              onChange={(e) => onChange(Number(e.target.value))}
              min={config.min}
              max={config.max}
              step={config.step || 1}
              className="flex-1"
            />
            <span className="w-12 text-center font-medium text-sm">
              {(value as number) || config.min}
            </span>
          </div>
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "select":
      return (
        <div className="space-y-1">
          <Select
            value={String(value) || ""}
            onValueChange={(newValue) => {
              // Convert back to number if the original option value was a number
              const selectedOption = config.options.find(opt => String(opt.value) === newValue)
              onChange(selectedOption ? selectedOption.value : newValue)
            }}
          >
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {config.options.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "toggle":
      return (
        <div className="space-y-1">
          <Switch checked={(value as boolean) || false} onCheckedChange={onChange} />
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "color":
      return (
        <div className="space-y-1">
          <ColorPicker color={(value as string) || "#000000"} onChange={onChange} />
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "image":
      return (
        <div className="space-y-2">
          <div className="group relative w-full rounded border">
            <div
              className={`flex w-full items-center justify-center overflow-hidden rounded transition-colors duration-200 ${config.aspectRatio ? `aspect-[${config.aspectRatio}]` : "aspect-[2/1]"}`}
            >
              <EditableImage
                fieldPath={config.name}
                src={(value as string) || ""}
                alt={config.label || "Image"}
                className="max-h-full max-w-full object-contain"
                buttons="below"
                aspectRatio={config.aspectRatio}
              />
            </div>
          </div>
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "object":
      return (
        <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
          {config.fields.map((subField) => (
            <div key={subField.name} className="space-y-2">
              <label htmlFor={`field-${subField.name}`} className="font-medium text-sm">
                {subField.label}
              </label>
              <div id={`field-${subField.name}`}>
                <DynamicField
                  config={subField}
                  value={(value as Record<string, unknown>)?.[subField.name] as FieldValue}
                  onChange={(subValue) =>
                    onChange({
                      ...((value as Record<string, unknown>) || {}),
                      [subField.name]: subValue
                    })
                  }
                />
              </div>
            </div>
          ))}
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )

    case "array": {
      const arrayValue = (value as FieldValue[]) || []

      return (
        <div className="space-y-3">
          {arrayValue.map((item: FieldValue, index: number) => (
            <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
              <div className="flex-1">
                <DynamicField
                  config={config.itemSchema}
                  value={item}
                  onChange={(newItem) => {
                    const newArray = [...arrayValue]
                    newArray[index] = newItem
                    onChange(newArray as FieldValue)
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newArray = arrayValue.filter((_: FieldValue, i: number) => i !== index)
                  onChange(newArray as FieldValue)
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
              onChange([...arrayValue, config.itemSchema.defaultValue || ""] as FieldValue)
            }}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {config.addButtonText || "Add Item"}
          </Button>

          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )
    }

    case "button": {
      const buttonConfig = config as Extract<FieldConfig, { type: "button" }>
      const isLoading = buttonConfig.loading

      return (
        <div className="space-y-1">
          <Button
            type="button"
            variant={buttonConfig.variant || "default"}
            size={buttonConfig.size || "default"}
            disabled={buttonConfig.disabled || isLoading}
            onClick={() => onAction?.(buttonConfig.action)}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonConfig.text}
          </Button>
          {hasError && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )
    }

    default:
      return (
        <div className="text-muted-foreground text-sm">
          Unsupported field type: {(config as { type: string }).type}
        </div>
      )
  }
}
