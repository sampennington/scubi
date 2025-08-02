import type { Block } from "@/lib/api"
import { BlockType } from "@/database/schema"

type BlockButton = {
  label: string
  url: string
  variant: "secondary" | "outline"
}

export type HeroBlockContent = {
  title: string
  text: string
  image: string
  primaryButton: BlockButton
  secondaryButton: BlockButton
}

export type TextBlockContent = {
  text: string
  alignment?: "left" | "center" | "right"
}

export type ImageBlockContent = {
  src: string
  alt: string
  caption?: string
}

export type ColumnContent = {
  icon?: string
  heading?: string
  body: string
}

export type MultiColumnBlockContent = {
  title?: string
  description?: string
  columns: ColumnContent[]
  columnsPerRow?: 1 | 2 | 3 | 4
  alignment?: "left" | "center" | "right"
  showIcons?: boolean
}

export type BlockWithContent =
  | (Block & { type: typeof BlockType.HERO; content: HeroBlockContent })
  | (Block & { type: typeof BlockType.TEXT; content: TextBlockContent })
  | (Block & { type: typeof BlockType.IMAGE; content: ImageBlockContent })
  | (Block & {
      type: typeof BlockType.MULTI_COLUMN
      content: MultiColumnBlockContent
    })
