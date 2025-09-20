import { z } from "zod"
import { BackgroundConfigSchema } from "../../shared/background"

export const InstagramGalleryContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  background: BackgroundConfigSchema.optional(),
  layout: z.enum(["grid", "carousel"]),
  columns: z.number().min(1).max(6),
  maxPosts: z.number().min(1).max(50),
  showCaption: z.boolean(),
  showLikes: z.boolean(),
  showComments: z.boolean(),
  showDate: z.boolean(),
  showOverlay: z.boolean(),
  hoverEffect: z.enum(["zoom", "fade", "slide", "none"]),
  postType: z.enum(["all", "image", "video", "carousel"]),
  sortBy: z.enum(["date", "likes", "comments"]),
  sortOrder: z.enum(["asc", "desc"]),
  aspectRatio: z.enum(["square", "portrait", "landscape", "original"]),
  spacing: z.enum(["none", "small", "medium", "large"]),
  verticalSpacing: z.enum(["none", "small", "medium", "large"]),
  openInNewTab: z.boolean(),
  fullWidth: z.boolean(),
  borderRadius: z.enum(["none", "small", "medium", "large", "full"]),
  overlayOnHover: z.boolean(),
  refetchPosts: z.any().optional()
})

export type InstagramGalleryContent = z.infer<typeof InstagramGalleryContentSchema>

export function isInstagramGalleryContent(data: unknown): data is InstagramGalleryContent {
  return InstagramGalleryContentSchema.safeParse(data).success
}
