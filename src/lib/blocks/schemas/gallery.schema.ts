import { z } from "zod"

export const GalleryImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional()
})

export const GalleryContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(GalleryImageSchema),
  layout: z.enum(["grid", "carousel", "masonry"]).optional(),
  columns: z.enum(["2", "3", "4"]).optional(),
  showCaptions: z.boolean().optional()
})

export type GalleryImage = z.infer<typeof GalleryImageSchema>
export type GalleryContent = z.infer<typeof GalleryContentSchema>

export function isGalleryContent(data: unknown): data is GalleryContent {
  return GalleryContentSchema.safeParse(data).success
}