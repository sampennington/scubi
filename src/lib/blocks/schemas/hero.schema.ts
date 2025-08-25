import { z } from "zod"

export const BlockButtonSchema = z.object({
  label: z.string(),
  url: z.string(),
  variant: z.enum([
    "default",
    "cta",
    "secondary", 
    "primary",
    "outline",
    "invert",
    "destructive",
    "ghost"
  ])
})

export const HeroContentSchema = z.object({
  title: z.string(),
  text: z.string(),
  image: z.string().optional(),
  logo: z.string().optional(),
  announcement: z.string().optional(),
  announcementUrl: z.string().optional(),
  primaryButton: BlockButtonSchema,
  secondaryButton: BlockButtonSchema,
  alignment: z.enum(["left", "center", "right"]).optional(),
  minHeight: z.number().optional()
})

export type BlockButton = z.infer<typeof BlockButtonSchema>
export type HeroContent = z.infer<typeof HeroContentSchema>

export function isHeroContent(data: unknown): data is HeroContent {
  return HeroContentSchema.safeParse(data).success
}