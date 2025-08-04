import { z } from "zod"
import { BlockType } from "@/database/schema"

// Base schemas for reusable components
const ButtonSchema = z.object({
  label: z.string().min(1, "Button label is required"),
  url: z.string().url("Must be a valid URL"),
  variant: z.enum(["secondary", "outline"]).optional()
})

const ImageDataSchema = z.object({
  src: z.string().url("Must be a valid URL"),
  alt: z.string().min(1, "Alt text is required"),
  caption: z.string().optional()
})

// Individual block type schemas
export const HeroContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(1, "Text is required"),
  image: z.string().url("Must be a valid URL"),
  primaryButton: ButtonSchema,
  secondaryButton: ButtonSchema
})

export const TextContentSchema = z.object({
  text: z.string().min(1, "Text is required")
})

export const ImageContentSchema = z.object({
  src: z.string().url("Must be a valid URL"),
  alt: z.string().min(1, "Alt text is required"),
  caption: z.string().optional()
})

export const DividerContentSchema = z.object({
  style: z.enum(["solid", "dashed", "dotted"]).optional(),
  color: z.string().optional(),
  thickness: z.number().min(1).max(10).optional()
})

export const ColumnDataSchema = z.object({
  title: z.string().min(1, "Column title is required"),
  content: z.string().min(1, "Column content is required"),
  image: z.string().url("Must be a valid URL").optional()
})

export const MultiColumnContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  columns: z.array(ColumnDataSchema).min(1, "At least one column is required")
})

export const GalleryContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  images: z.array(ImageDataSchema).min(1, "At least one image is required")
})

export const TestimonialDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  content: z.string().min(1, "Testimonial content is required"),
  avatar: z.string().url("Must be a valid URL").optional()
})

export const TestimonialsContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  testimonials: z
    .array(TestimonialDataSchema)
    .min(1, "At least one testimonial is required")
})

export const MemberDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().min(1, "Bio is required"),
  image: z.string().url("Must be a valid URL"),
  email: z.string().email("Must be a valid email").optional(),
  linkedin: z.string().url("Must be a valid URL").optional()
})

export const TeamContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  members: z.array(MemberDataSchema).min(1, "At least one member is required")
})

export const FAQItemDataSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required")
})

export const FAQContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  items: z.array(FAQItemDataSchema).min(1, "At least one FAQ item is required")
})

export const ContactFormContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  email: z.string().email("Must be a valid email")
})

export const CallToActionContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(1, "Text is required"),
  buttonText: z.string().min(1, "Button text is required"),
  buttonUrl: z.string().url("Must be a valid URL"),
  variant: z.enum(["default", "secondary", "outline"]).default("default")
})

export const VideoContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Must be a valid video URL"),
  thumbnail: z.string().url("Must be a valid URL").optional()
})

export const MapContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
})

export const SocialFeedContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  platform: z.enum(["instagram", "twitter", "facebook"]),
  username: z.string().min(1, "Username is required"),
  postCount: z.number().min(1).max(20).default(6)
})

export const TwoColumnContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  leftContent: z.string().min(1, "Left content is required"),
  rightContent: z.string().min(1, "Right content is required"),
  leftImage: z.string().url("Must be a valid URL").optional(),
  rightImage: z.string().url("Must be a valid URL").optional()
})

export const CourseDataSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Course description is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().url("Must be a valid URL"),
  instructor: z.string().min(1, "Instructor is required")
})

export const CoursesContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  courses: z.array(CourseDataSchema).min(1, "At least one course is required")
})

export const MarineLifeDataSchema = z.object({
  name: z.string().min(1, "Species name is required"),
  description: z.string().min(1, "Description is required"),
  habitat: z.string().min(1, "Habitat is required"),
  image: z.string().url("Must be a valid URL"),
  scientificName: z.string().optional()
})

export const MarineLifeContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  species: z
    .array(MarineLifeDataSchema)
    .min(1, "At least one species is required")
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
  [BlockType.TWO_COLUMN]: TwoColumnContentSchema,
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
export type TwoColumnContent = z.infer<typeof TwoColumnContentSchema>
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
  return TwoColumnContentSchema.safeParse(data).success
}

export function isCoursesContent(data: unknown): data is CoursesContent {
  return CoursesContentSchema.safeParse(data).success
}

export function isMarineLifeContent(data: unknown): data is MarineLifeContent {
  return MarineLifeContentSchema.safeParse(data).success
}

// Helper function to validate block content with proper typing
export function validateBlockContent(
  blockType: string,
  content: Record<string, unknown>
):
  | {
      success: true
      data:
        | HeroContent
        | TextContent
        | ImageContent
        | DividerContent
        | MultiColumnContent
        | GalleryContent
        | TestimonialsContent
        | TeamContent
        | FAQContent
        | ContactFormContent
        | CallToActionContent
        | VideoContent
        | MapContent
        | SocialFeedContent
        | TwoColumnContent
        | CoursesContent
        | MarineLifeContent
    }
  | {
      success: false
      error: { errors: Array<{ path: string[]; message: string }> }
    } {
  const schema = BlockSchemas[blockType as keyof typeof BlockSchemas]
  if (!schema) {
    return {
      success: false,
      error: {
        errors: [{ path: [], message: `Unknown block type: ${blockType}` }]
      }
    }
  }

  const result = schema.safeParse(content)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    // Check if the error has the expected structure
    const error = result.error as {
      errors?: Array<{ path: (string | number)[]; message: string }>
    }

    return {
      success: false,
      error: {
        errors:
          error.errors?.map((err) => ({
            path: err.path.map((p) => String(p)),
            message: err.message
          })) || []
      }
    }
  }
}
