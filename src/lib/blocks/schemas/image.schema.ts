import { z } from "zod"

export const ImageContentSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional()
})

export type ImageContent = z.infer<typeof ImageContentSchema>

export function isImageContent(data: unknown): data is ImageContent {
  return ImageContentSchema.safeParse(data).success
}