"use client"

import { useState, useCallback, useMemo } from "react"
import {
  BlockSettingsPanel,
  SettingsSection as BaseSettingsSection,
  SettingItem
} from "@/components/blocks/editable/settings-panel"
import type { SettingsConfig, FormState, FieldState } from "@/lib/blocks/core/config-types"
import { DynamicField } from "./dynamic-field"
import { evaluateCondition } from "./condition-evaluator"

interface DynamicSettingsProps {
  config: SettingsConfig
  value: Record<string, any>
  onChange: (field: string, value: any) => void
  title?: string
}

export function DynamicSettings({
  config,
  value,
  onChange,
  title = "Block Settings"
}: DynamicSettingsProps) {
  const [formState, setFormState] = useState<FormState>(() => initializeFormState(config, value))

  const updateFieldState = useCallback((fieldName: string, updates: Partial<FieldState>) => {
    setFormState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: {
          ...prev.fields[fieldName],
          ...updates
        }
      }
    }))
  }, [])

  const handleFieldChange = useCallback(
    (fieldName: string, newValue: any) => {
      updateFieldState(fieldName, {
        value: newValue,
        touched: true
      })
      onChange(fieldName, newValue)

      // Re-evaluate visibility for all fields after change
      updateFieldVisibility(config, { ...value, [fieldName]: newValue }, setFormState)
    },
    [config, value, onChange, updateFieldState]
  )

  const visibleSections = useMemo(() => {
    return config.sections
      .map((section) => ({
        ...section,
        fields: section.fields.filter((field) => formState.fields[field.name]?.visible !== false)
      }))
      .filter((section) => section.fields.length > 0)
  }, [config.sections, formState.fields])

  return (
    <BlockSettingsPanel title={title}>
      {visibleSections.map((section) => (
        <BaseSettingsSection key={section.id} title={section.title}>
          {section.description && (
            <p className="mb-4 text-muted-foreground text-sm">{section.description}</p>
          )}

          {section.fields.map((field) => {
            const fieldState = formState.fields[field.name]
            const fieldValue = value[field.name] ?? field.defaultValue

            return (
              <SettingItem key={field.name} label={field.label} description={field.description}>
                <DynamicField
                  config={field}
                  value={fieldValue}
                  onChange={(newValue) => handleFieldChange(field.name, newValue)}
                  error={fieldState?.error}
                  touched={fieldState?.touched}
                />
              </SettingItem>
            )
          })}
        </BaseSettingsSection>
      ))}
    </BlockSettingsPanel>
  )
}

function initializeFormState(config: SettingsConfig, value: Record<string, any>): FormState {
  const fields: Record<string, FieldState> = {}

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      fields[field.name] = {
        value: value[field.name] ?? field.defaultValue,
        touched: false,
        visible: true,
        error: undefined
      }
    })
  })

  updateFieldVisibility(config, value, (updater) => {
    const newState = updater({ fields, isValid: true, isDirty: false })
    Object.assign(fields, newState.fields)
  })

  return {
    fields,
    isValid: true,
    isDirty: false
  }
}

function updateFieldVisibility(
  config: SettingsConfig,
  currentValues: Record<string, any>,
  setFormState: (updater: (prev: FormState) => FormState) => void
) {
  setFormState((prev) => {
    const newFields = { ...prev.fields }

    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.conditions) {
          const visible = field.conditions.every((condition) =>
            evaluateCondition(condition, currentValues)
          )

          if (newFields[field.name]) {
            newFields[field.name] = {
              ...newFields[field.name],
              visible
            }
          }
        }
      })
    })

    return {
      ...prev,
      fields: newFields
    }
  })
}
