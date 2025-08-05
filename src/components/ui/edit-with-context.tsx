"use client"

import { Edit } from "./edit"
import { useBlockEdit } from "./block-edit-context"
import type { ComponentProps, ReactNode } from "react"
import type { BlockButton } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"
import { EditableButton } from "../editable"

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

  h2: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.h2>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.h2 {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.h2>
    )
  },

  h3: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.h3>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.h3 {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.h3>
    )
  },

  h4: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.h4>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.h4 {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.h4>
    )
  },

  h5: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.h5>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.h5 {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.h5>
    )
  },

  h6: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.h6>) => {
    const { handleEdit } = useBlockEdit()
    return (
      <Edit.h6 {...props} onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.h6>
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
    variant?: BlockButton["variant"]
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
