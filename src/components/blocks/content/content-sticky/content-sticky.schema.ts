import { z } from "zod"
import { BackgroundConfigSchema } from "../../shared/background"

export const contentStickySchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  content: z.string(),
  background: BackgroundConfigSchema.optional(),
  features: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string()
    })
  ),
  bottomTitle: z.string(),
  bottomContent: z.string()
})

export type ContentStickyContent = z.infer<typeof contentStickySchema>
