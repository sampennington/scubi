import { z } from "zod"
import { BlockType } from "@/database/schema"

// Base schemas for reusable components
const BlockButtonSchema = z.object({
  label: z.string(),
  url: z.string(),
  variant: z.enum(["default", "cta", "secondary", "outline", "invert"])
})

// Individual block type schemas
export const HeroContentSchema = z.object({
  title: z.string(),
  text: z.string(),
  image: z.string(),
  primaryButton: BlockButtonSchema,
  secondaryButton: BlockButtonSchema
})

export const TextContentSchema = z.object({
  text: z.string(),
  alignment: z.enum(["left", "center", "right"]).optional()
})

export const ImageContentSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional()
})

export const ColumnContentSchema = z.object({
  icon: z.string().optional(),
  heading: z.string().optional(),
  body: z.string()
})

export const MultiColumnContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(ColumnContentSchema),
  columnsPerRow: z.enum(["1", "2", "3", "4"]).optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  showIcons: z.boolean().optional()
})

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

export const TestimonialSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string(),
  rating: z.enum(["1", "2", "3", "4", "5"]),
  photo: z.string().optional()
})

export const TestimonialsContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  testimonials: z.array(TestimonialSchema),
  layout: z.enum(["grid", "carousel"]).optional(),
  columns: z.enum(["2", "3"]).optional(),
  showPhotos: z.boolean().optional(),
  showRatings: z.boolean().optional()
})

export const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  photo: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional()
    })
    .optional()
})

export const TeamContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  members: z.array(TeamMemberSchema),
  layout: z.enum(["grid", "list"]).optional(),
  columns: z.enum(["2", "3", "4"]).optional(),
  showContactInfo: z.boolean().optional(),
  showSocialLinks: z.boolean().optional(),
  fullWidthPhoto: z.boolean().optional()
})

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string()
})

export const FAQContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(FAQItemSchema),
  layout: z.enum(["accordion", "list"]).optional(),
  allowMultipleOpen: z.boolean().optional()
})

export const ContactFormFieldSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "email", "tel", "textarea", "select"]),
  label: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional()
})

export const ContactFormContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(ContactFormFieldSchema),
  submitButtonText: z.string().optional(),
  successMessage: z.string().optional(),
  emailTo: z.string().optional()
})

export const CallToActionContentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  primaryButton: BlockButtonSchema,
  secondaryButton: BlockButtonSchema.optional(),
  backgroundImage: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).optional()
})

export const VideoContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string(),
  provider: z.enum(["youtube", "vimeo", "custom"]),
  autoplay: z.boolean().optional(),
  controls: z.boolean().optional(),
  width: z.number().optional(),
  height: z.number().optional()
})

export const MapContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  address: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  zoom: z.number().optional(),
  apiKey: z.string().optional(),
  showMarker: z.boolean().optional(),
  height: z.number().optional()
})

export const SocialFeedContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  platform: z.enum(["instagram", "twitter", "facebook"]),
  username: z.string(),
  postCount: z.number().optional(),
  showCaptions: z.boolean().optional(),
  layout: z.enum(["grid", "carousel"]).optional(),
  columns: z.enum(["3", "4", "6"]).optional()
})

export const DividerContentSchema = z.object({
  text: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  style: z.enum(["solid", "dashed", "dotted"]).optional(),
  color: z.string().optional(),
  thickness: z.number().optional()
})

export const TwoColumnContentSchema = z.object({
  leftContent: z.object({
    type: z.enum(["text", "image", "video"]),
    content: z.string(),
    title: z.string().optional()
  }),
  rightContent: z.object({
    type: z.enum(["text", "image", "video"]),
    content: z.string(),
    title: z.string().optional()
  }),
  layout: z.enum(["text-image", "image-text", "text-text"]).optional(),
  alignment: z.enum(["top", "center", "bottom"]).optional(),
  spacing: z.number().optional()
})

export const TwoColumnBlockContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: TwoColumnContentSchema,
  background: z.string().optional(),
  padding: z.number().optional()
})

export const CourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number(),
  currency: z.string().optional(),
  maxDepth: z.number().optional(),
  maxStudents: z.number().optional(),
  includes: z.array(z.string()).optional(),
  image: z.string().optional()
})

export const CoursesContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  courses: z.array(CourseSchema),
  layout: z.enum(["grid", "list"]).optional(),
  columns: z.enum(["2", "3"]).optional(),
  showPricing: z.boolean().optional(),
  showLevels: z.boolean().optional()
})

export const MarineLifeItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  season: z.enum(["year-round", "spring", "summer", "fall", "winter"]),
  image: z.string().optional(),
  depth: z.string().optional(),
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional()
})

export const MarineLifeContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(MarineLifeItemSchema),
  currentSeason: z.enum(["spring", "summer", "fall", "winter"]).optional(),
  layout: z.enum(["grid", "list"]).optional(),
  columns: z.enum(["2", "3", "4"]).optional(),
  showSeasonalFilter: z.boolean().optional()
})

// Schema map for easy lookup
export const BlockSchemas = {
  [BlockType.HERO]: HeroContentSchema,
  [BlockType.TEXT]: TextContentSchema,
  [BlockType.IMAGE]: ImageContentSchema,
  [BlockType.DIVIDER]: DividerContentSchema,
  [BlockType.MULTI_COLUMN]: MultiColumnContentSchema,
  [BlockType.GALLERY]: GalleryContentSchema,
  [BlockType.TESTIMONIALS]: TestimonialsContentSchema,
  [BlockType.TEAM]: TeamContentSchema,
  [BlockType.FAQ]: FAQContentSchema,
  [BlockType.CONTACT_FORM]: ContactFormContentSchema,
  [BlockType.CALL_TO_ACTION]: CallToActionContentSchema,
  [BlockType.VIDEO]: VideoContentSchema,
  [BlockType.MAP]: MapContentSchema,
  [BlockType.SOCIAL_FEED]: SocialFeedContentSchema,
  [BlockType.TWO_COLUMN]: TwoColumnBlockContentSchema,
  [BlockType.COURSES]: CoursesContentSchema,
  [BlockType.MARINE_LIFE]: MarineLifeContentSchema
} as const

// Type exports for use in components
export type HeroContent = z.infer<typeof HeroContentSchema>
export type TextContent = z.infer<typeof TextContentSchema>
export type ImageContent = z.infer<typeof ImageContentSchema>
export type DividerContent = z.infer<typeof DividerContentSchema>
export type MultiColumnContent = z.infer<typeof MultiColumnContentSchema>
export type GalleryContent = z.infer<typeof GalleryContentSchema>
export type TestimonialsContent = z.infer<typeof TestimonialsContentSchema>
export type TeamContent = z.infer<typeof TeamContentSchema>
export type FAQContent = z.infer<typeof FAQContentSchema>
export type ContactFormContent = z.infer<typeof ContactFormContentSchema>
export type CallToActionContent = z.infer<typeof CallToActionContentSchema>
export type VideoContent = z.infer<typeof VideoContentSchema>
export type MapContent = z.infer<typeof MapContentSchema>
export type SocialFeedContent = z.infer<typeof SocialFeedContentSchema>
export type TwoColumnContent = z.infer<typeof TwoColumnBlockContentSchema>
export type CoursesContent = z.infer<typeof CoursesContentSchema>
export type MarineLifeContent = z.infer<typeof MarineLifeContentSchema>

// Type guard functions for each block type
export function isHeroContent(data: unknown): data is HeroContent {
  return HeroContentSchema.safeParse(data).success
}

export function isTextContent(data: unknown): data is TextContent {
  return TextContentSchema.safeParse(data).success
}

export function isImageContent(data: unknown): data is ImageContent {
  return ImageContentSchema.safeParse(data).success
}

export function isDividerContent(data: unknown): data is DividerContent {
  return DividerContentSchema.safeParse(data).success
}

export function isMultiColumnContent(
  data: unknown
): data is MultiColumnContent {
  return MultiColumnContentSchema.safeParse(data).success
}

export function isGalleryContent(data: unknown): data is GalleryContent {
  return GalleryContentSchema.safeParse(data).success
}

export function isTestimonialsContent(
  data: unknown
): data is TestimonialsContent {
  return TestimonialsContentSchema.safeParse(data).success
}

export function isTeamContent(data: unknown): data is TeamContent {
  return TeamContentSchema.safeParse(data).success
}

export function isFAQContent(data: unknown): data is FAQContent {
  return FAQContentSchema.safeParse(data).success
}

export function isContactFormContent(
  data: unknown
): data is ContactFormContent {
  return ContactFormContentSchema.safeParse(data).success
}

export function isCallToActionContent(
  data: unknown
): data is CallToActionContent {
  return CallToActionContentSchema.safeParse(data).success
}

export function isVideoContent(data: unknown): data is VideoContent {
  return VideoContentSchema.safeParse(data).success
}

export function isMapContent(data: unknown): data is MapContent {
  return MapContentSchema.safeParse(data).success
}

export function isSocialFeedContent(data: unknown): data is SocialFeedContent {
  return SocialFeedContentSchema.safeParse(data).success
}

export function isTwoColumnContent(data: unknown): data is TwoColumnContent {
  return TwoColumnBlockContentSchema.safeParse(data).success
}

export function isCoursesContent(data: unknown): data is CoursesContent {
  return CoursesContentSchema.safeParse(data).success
}

export function isMarineLifeContent(data: unknown): data is MarineLifeContent {
  return MarineLifeContentSchema.safeParse(data).success
}
