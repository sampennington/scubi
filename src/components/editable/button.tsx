"use client"

import { Edit } from "../ui/edit"
import { useBlockEdit } from "./block-edit-context"
import type { ReactNode } from "react"
import type { BlockButton } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

interface EditableButtonProps {
  fieldPath: string
  children: string
  icon?: ReactNode
  variant?: BlockButton["variant"]
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

const getButtonStyles = (variant: string, size: string) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
    invert: "bg-white text-black hover:bg-gray-100",
    cta: "bg-cta text-primary-foreground hover:bg-cta/90"
  }

  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  }

  return `${baseStyles} ${variantStyles[variant as keyof typeof variantStyles] || variantStyles.default} ${sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.default}`
}

export const EditableButton = ({
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
}: EditableButtonProps) => {
  const { handleEdit } = useBlockEdit()

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${getButtonStyles(variant, size)} ${className}`}
      {...props}
    >
      {icon && icon}

      <Edit.span onSave={(value) => handleEdit(fieldPath, value)}>
        {children}
      </Edit.span>
    </button>
  )
}
