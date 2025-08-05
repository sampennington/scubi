"use client"

import { Edit } from "./edit"
import { useBlockEdit } from "./block-edit-context"
import type { ComponentProps, ReactNode } from "react"
import { EditableButton } from "./editable"

// Enhanced Edit components that use context - shorter syntax
export const E = {
  h1: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.h1>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.h1 {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.h1>
    )
  },

  p: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.p>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.p {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.p>
    )
  },

  span: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.span>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.span {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.span>
    )
  },

  div: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.div>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.div {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.div>
    )
  },

  button: ({
    fieldPath,
    children,
    icon,
    variant = "default",
    size = "default",
    className = "",
    disabled = false,
    type = "button",
    onClick,
    ...props
  }: {
    fieldPath: string
    children: string
    icon?: ReactNode
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "invert"
      | "cta"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
    disabled?: boolean
    type?: "button" | "submit" | "reset"
    onClick?: () => void
  }) => {
    return (
      <EditableButton
        fieldPath={fieldPath}
        icon={icon}
        variant={variant}
        size={size}
        className={className}
        disabled={disabled}
        type={type}
        onClick={onClick}
        {...props}
      >
        {children}
      </EditableButton>
    )
  }
}

// Keep the old name for backward compatibility
export const EditWithContext = E
