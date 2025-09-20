import type { InstagramGalleryContent } from "./instagram-gallery.schema"
import { defaultBackgroundConfig } from "../../shared/background"

export const defaultInstagramGalleryContent: InstagramGalleryContent = {
  title: "Follow Us on Instagram",
  description: "Check out our latest diving adventures and underwater photography",
  layout: "grid",
  columns: 4,
  maxPosts: 12,
  showCaption: true,
  showLikes: true,
  showComments: true,
  showDate: false,
  showOverlay: true,
  hoverEffect: "zoom",
  postType: "all",
  sortBy: "date",
  sortOrder: "desc",
  aspectRatio: "square",
  spacing: "medium",
  verticalSpacing: "medium",
  openInNewTab: true,
  fullWidth: false,
  borderRadius: "medium",
  overlayOnHover: false,
  background: defaultBackgroundConfig
}
