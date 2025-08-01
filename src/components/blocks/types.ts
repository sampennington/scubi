import type { Block } from "@/lib/api"

export type HeroBlockContent = {
  title: string
  description: string
  image: string
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
