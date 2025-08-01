import type { Block } from "@/lib/api"

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

export type BlockWithContent =
  | (Block & { type: "hero"; content: HeroBlockContent })
  | (Block & { type: "text"; content: TextBlockContent })
  | (Block & { type: "image"; content: ImageBlockContent })
