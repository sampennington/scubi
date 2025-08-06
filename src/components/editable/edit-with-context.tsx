"use client"

import { useState } from "react"
import { Edit } from "../ui/edit"
import { useBlockEdit } from "./block-edit-context"
import type { ComponentProps, ReactNode } from "react"
import type { BlockButton } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"
import { EditableButton } from "."
import Image from "next/image"
import { Button } from "../ui/button"
import { EditableImage } from "./editable-image"

export const E = {
  h1: ({
    fieldPath,
    children,
    ...props
  }: { fieldPath: string } & ComponentProps<typeof Edit.h1>) => {
    const { handleEdit, isEditMode } = useBlockEdit()
    console.log({ isEditMode })
    if (!isEditMode) {
      return <h1 {...props}>{children}</h1>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <h2 {...props}>{children}</h2>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <h3 {...props}>{children}</h3>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <h4 {...props}>{children}</h4>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <h5 {...props}>{children}</h5>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <h6 {...props}>{children}</h6>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <p {...props}>{children}</p>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <span {...props}>{children}</span>
    }

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
    const { handleEdit, isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <div {...props}>{children}</div>
    }

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
    const { isEditMode } = useBlockEdit()

    if (!isEditMode) {
      return <Button {...props}>{children}</Button>
    }

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
  },

  image: ({
    fieldPath,
    src,
    alt,
    width,
    height,
    ...props
  }: {
    fieldPath: string
    src: string
    alt: string
    width?: number
    height?: number
    aspectRatio?: "square" | "video" | "auto"
  } & ComponentProps<"img">) => {
    const { isEditMode } = useBlockEdit()
    const [imageError, setImageError] = useState(false)

    if (!src || src === "" || imageError) {
      return null
    }

    if (!isEditMode) {
      return <Image src={src} alt={alt} width={width} height={height} />
    }

    return (
      <EditableImage
        {...props}
        fieldPath={fieldPath}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={() => setImageError(true)}
      />
    )
  }
}

// Keep the old name for backward compatibility
export const EditWithContext = E
