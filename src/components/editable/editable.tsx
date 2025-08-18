"use client"

import { useState } from "react"
import { Edit } from "../ui/edit"
import type { ComponentProps } from "react"
import { EditableImage, NoEditImage } from "./editable-image"
import { useSite } from "../../app/preview/components/site-context"
import { Button } from "./button"

export const E = {
  h1: Edit.h1,
  h2: Edit.h2,
  h3: Edit.h3,
  h4: Edit.h4,
  h5: Edit.h5,
  h6: Edit.h6,
  p: Edit.p,
  span: Edit.span,
  div: Edit.div,
  button: Button,
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
  } & ComponentProps<"img">) => {
    const { isEditMode } = useSite()
    const [imageError, setImageError] = useState(false)

    if (imageError) {
      console.log(imageError)
    }

    if (!isEditMode) {
      return <NoEditImage src={src} alt={alt} width={width || 400} height={height || 300} />
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
