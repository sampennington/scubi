"use client"

import { useSite } from "@/app/preview/components/site-context"
import { EditableBlock } from "@/components/editable/EditableBlock"
import type { ComponentProps, JSX } from "react"
import { useBlockEdit } from "../editable/block-edit-context"

interface EditElementProps {
  children: string
  fieldPath: string
  onSave?: (value: string) => void
  placeholder?: string
  multiline?: boolean
  maxLength?: number
  className?: string
}

const createEditableElement = <T extends keyof JSX.IntrinsicElements>(
  element: T,
  defaultMultiline = false
) => {
  return ({
    children,
    onSave,
    placeholder,
    multiline = defaultMultiline,
    maxLength,
    className,
    fieldPath,
    ...props
  }: EditElementProps & ComponentProps<T>) => {
    const { isEditMode } = useSite()
    const { handleEdit } = useBlockEdit()

    const Element = element as React.ElementType

    if (!isEditMode) {
      return (
        <Element className={className} {...props}>
          {children}
        </Element>
      )
    }

    return (
      <EditableBlock
        value={children}
        onSave={(value) => handleEdit(fieldPath, value)}
        placeholder={placeholder}
        multiline={multiline}
        maxLength={maxLength}
        className={className}
      >
        <Element {...props}>{children}</Element>
      </EditableBlock>
    )
  }
}

// Headings
const EditH1 = createEditableElement("h1")
const EditH2 = createEditableElement("h2")
const EditH3 = createEditableElement("h3")
const EditH4 = createEditableElement("h4")
const EditH5 = createEditableElement("h5")
const EditH6 = createEditableElement("h6")

// Text elements
const EditP = createEditableElement("p", true)
const EditSpan = createEditableElement("span")
const EditDiv = createEditableElement("div", true)
const EditLabel = createEditableElement("label")

// Interactive elements
const EditButton = createEditableElement("button")
const EditA = createEditableElement("a")

// List elements
const EditLi = createEditableElement("li")
const EditDt = createEditableElement("dt")
const EditDd = createEditableElement("dd")

// Form elements (text content only)
const EditLegend = createEditableElement("legend")
const EditCaption = createEditableElement("caption")

// Table elements
const EditTh = createEditableElement("th")
const EditTd = createEditableElement("td")

// Semantic elements
const EditStrong = createEditableElement("strong")
const EditB = createEditableElement("b")
const EditEm = createEditableElement("em")
const EditI = createEditableElement("i")
const EditU = createEditableElement("u")
const EditMark = createEditableElement("mark")
const EditSmall = createEditableElement("small")
const EditDel = createEditableElement("del")
const EditIns = createEditableElement("ins")
const EditSub = createEditableElement("sub")
const EditSup = createEditableElement("sup")

// Code elements
const EditCode = createEditableElement("code")
const EditPre = createEditableElement("pre", true)
const EditKbd = createEditableElement("kbd")

// Quote elements
const EditBlockquote = createEditableElement("blockquote", true)
const EditCite = createEditableElement("cite")

// Time and data
const EditTime = createEditableElement("time")
const EditData = createEditableElement("data")

// Address and contact
const EditAddress = createEditableElement("address", true)

// Article elements
const EditArticle = createEditableElement("article", true)
const EditSection = createEditableElement("section", true)
const EditAside = createEditableElement("aside", true)
const EditHeader = createEditableElement("header", true)
const EditFooter = createEditableElement("footer", true)
const EditNav = createEditableElement("nav", true)
const EditMain = createEditableElement("main", true)

// Figure elements
const EditFigcaption = createEditableElement("figcaption")

// Details elements
const EditSummary = createEditableElement("summary")

// Dialog elements
const EditDialog = createEditableElement("dialog", true)

// Meter and progress
const EditMeter = createEditableElement("meter")
const EditProgress = createEditableElement("progress")

// Output elements
const EditOutput = createEditableElement("output")

// Template elements
const EditTemplate = createEditableElement("template", true)

// Slot elements
const EditSlot = createEditableElement("slot")

export const Edit = {
  // Headings
  h1: EditH1,
  h2: EditH2,
  h3: EditH3,
  h4: EditH4,
  h5: EditH5,
  h6: EditH6,

  // Text elements
  p: EditP,
  span: EditSpan,
  div: EditDiv,
  label: EditLabel,

  // Interactive elements
  button: EditButton,
  a: EditA,

  // List elements
  li: EditLi,
  dt: EditDt,
  dd: EditDd,

  // Form elements
  legend: EditLegend,
  caption: EditCaption,

  // Table elements
  th: EditTh,
  td: EditTd,

  // Semantic elements
  strong: EditStrong,
  b: EditB,
  em: EditEm,
  i: EditI,
  u: EditU,
  mark: EditMark,
  small: EditSmall,
  del: EditDel,
  ins: EditIns,
  sub: EditSub,
  sup: EditSup,

  // Code elements
  code: EditCode,
  pre: EditPre,
  kbd: EditKbd,

  // Quote elements
  blockquote: EditBlockquote,
  cite: EditCite,

  // Time and data
  time: EditTime,
  data: EditData,

  // Address and contact
  address: EditAddress,

  // Article elements
  article: EditArticle,
  section: EditSection,
  aside: EditAside,
  header: EditHeader,
  footer: EditFooter,
  nav: EditNav,
  main: EditMain,

  // Figure elements
  figcaption: EditFigcaption,

  // Details elements
  summary: EditSummary,

  // Dialog elements
  dialog: EditDialog,

  // Meter and progress
  meter: EditMeter,
  progress: EditProgress,

  // Output elements
  output: EditOutput,

  // Template elements
  template: EditTemplate,

  // Slot elements
  slot: EditSlot,

  // Raw EditableBlock for custom usage
  block: EditableBlock
} as const

export type EditElement = keyof typeof Edit
