import { z } from "zod"
import { BlockButtonSchema } from "../../shared/primitives"

export const HeroNavigationItemSchema = z.object({
  name: z.string(),
  href: z.string()
})

export const HeroContentSchema = z.object({
  title: z.string(),
  text: z.string(),
  image: z.string().optional(),
  logo: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryButton: BlockButtonSchema,
  secondaryButton: BlockButtonSchema,
  alignment: z.enum(["left", "center", "right"]).optional(),
  minHeight: z.number().optional(),
  navigation: z.array(HeroNavigationItemSchema).optional(),
  showNavigation: z.boolean().optional(),
  showLogin: z.boolean().optional()
})

export type HeroBlockButton = z.infer<typeof BlockButtonSchema>
export type HeroNavigationItem = z.infer<typeof HeroNavigationItemSchema>
export type HeroContent = z.infer<typeof HeroContentSchema>

export function isHeroContent(data: unknown): data is HeroContent {
  return HeroContentSchema.safeParse(data).success
}
