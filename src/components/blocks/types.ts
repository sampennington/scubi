import type { Block } from "@/lib/api"
import type { BlockType } from "@/database/schema"

type BlockButton = {
  label: string
  url: string
  variant: "secondary" | "outline"
}

export type HeroBlockContent = {
  title: string
  text: string
  image: string
  primaryButton: BlockButton
  secondaryButton: BlockButton
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

export type ColumnContent = {
  icon?: string
  heading?: string
  body: string
}

export type MultiColumnBlockContent = {
  title?: string
  description?: string
  columns: ColumnContent[]
  columnsPerRow?: 1 | 2 | 3 | 4
  alignment?: "left" | "center" | "right"
  showIcons?: boolean
}

export type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

export type GalleryBlockContent = {
  title?: string
  description?: string
  images: GalleryImage[]
  layout?: "grid" | "carousel" | "masonry"
  columns?: 2 | 3 | 4
  showCaptions?: boolean
}

export type Testimonial = {
  name: string
  role?: string
  company?: string
  content: string
  rating: 1 | 2 | 3 | 4 | 5
  photo?: string
}

export type TestimonialsBlockContent = {
  title?: string
  description?: string
  testimonials: Testimonial[]
  layout?: "grid" | "carousel"
  columns?: 2 | 3
  showPhotos?: boolean
  showRatings?: boolean
}

export type TeamMember = {
  name: string
  role: string
  bio: string
  photo: string
  email?: string
  phone?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
}

export type TeamBlockContent = {
  title?: string
  description?: string
  members: TeamMember[]
  layout?: "grid" | "list"
  columns?: 2 | 3 | 4
  showContactInfo?: boolean
  showSocialLinks?: boolean
  fullWidthPhoto?: boolean
}

export type FAQItem = {
  question: string
  answer: string
}

export type FAQBlockContent = {
  title?: string
  description?: string
  items: FAQItem[]
  layout?: "accordion" | "list"
  allowMultipleOpen?: boolean
}

export type ContactFormField = {
  name: string
  type: "text" | "email" | "tel" | "textarea" | "select"
  label: string
  required?: boolean
  placeholder?: string
  options?: string[] // for select fields
}

export type ContactFormBlockContent = {
  title?: string
  description?: string
  fields: ContactFormField[]
  submitButtonText?: string
  successMessage?: string
  emailTo?: string
}

export type CallToActionBlockContent = {
  title: string
  description?: string
  primaryButton: BlockButton
  secondaryButton?: BlockButton
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
  alignment?: "left" | "center" | "right"
}

export type VideoBlockContent = {
  title?: string
  description?: string
  videoUrl: string
  provider: "youtube" | "vimeo" | "custom"
  autoplay?: boolean
  controls?: boolean
  width?: number
  height?: number
}

export type MapBlockContent = {
  title?: string
  description?: string
  address: string
  latitude?: number
  longitude?: number
  zoom?: number
  apiKey?: string
  showMarker?: boolean
  height?: number
}

export type SocialFeedBlockContent = {
  title?: string
  description?: string
  platform: "instagram" | "twitter" | "facebook"
  username: string
  postCount?: number
  showCaptions?: boolean
  layout?: "grid" | "carousel"
  columns?: 3 | 4 | 6
}

export type DividerBlockContent = {
  text?: string
  alignment?: "left" | "center" | "right"
  style?: "solid" | "dashed" | "dotted"
  color?: string
  thickness?: number
}

export type TwoColumnContent = {
  leftContent: {
    type: "text" | "image" | "video"
    content: string
    title?: string
  }
  rightContent: {
    type: "text" | "image" | "video"
    content: string
    title?: string
  }
  layout?: "text-image" | "image-text" | "text-text"
  alignment?: "top" | "center" | "bottom"
  spacing?: number
}

export type TwoColumnBlockContent = {
  title?: string
  description?: string
  content: TwoColumnContent
  background?: string
  padding?: number
}

export type Course = {
  title: string
  description: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  price: number
  currency?: string
  maxDepth?: number
  maxStudents?: number
  includes?: string[]
  image?: string
}

export type CoursesBlockContent = {
  title?: string
  description?: string
  courses: Course[]
  layout?: "grid" | "list"
  columns?: 2 | 3
  showPricing?: boolean
  showLevels?: boolean
}

export type MarineLifeItem = {
  name: string
  description: string
  season: "year-round" | "spring" | "summer" | "fall" | "winter"
  image?: string
  depth?: string
  difficulty?: "easy" | "moderate" | "challenging"
}

export type MarineLifeBlockContent = {
  title?: string
  description?: string
  items: MarineLifeItem[]
  currentSeason?: "spring" | "summer" | "fall" | "winter"
  layout?: "grid" | "list"
  columns?: 2 | 3 | 4
  showSeasonalFilter?: boolean
}

export type BlockWithContent =
  | (Block & { type: typeof BlockType.HERO; content: HeroBlockContent })
  | (Block & { type: typeof BlockType.TEXT; content: TextBlockContent })
  | (Block & { type: typeof BlockType.IMAGE; content: ImageBlockContent })
  | (Block & {
      type: typeof BlockType.MULTI_COLUMN
      content: MultiColumnBlockContent
    })
  | (Block & { type: typeof BlockType.GALLERY; content: GalleryBlockContent })
  | (Block & {
      type: typeof BlockType.TESTIMONIALS
      content: TestimonialsBlockContent
    })
  | (Block & { type: typeof BlockType.TEAM; content: TeamBlockContent })
  | (Block & { type: typeof BlockType.FAQ; content: FAQBlockContent })
  | (Block & {
      type: typeof BlockType.CONTACT_FORM
      content: ContactFormBlockContent
    })
  | (Block & {
      type: typeof BlockType.CALL_TO_ACTION
      content: CallToActionBlockContent
    })
  | (Block & { type: typeof BlockType.VIDEO; content: VideoBlockContent })
  | (Block & { type: typeof BlockType.MAP; content: MapBlockContent })
  | (Block & {
      type: typeof BlockType.SOCIAL_FEED
      content: SocialFeedBlockContent
    })
  | (Block & { type: typeof BlockType.DIVIDER; content: DividerBlockContent })
  | (Block & {
      type: typeof BlockType.TWO_COLUMN
      content: TwoColumnBlockContent
    })
  | (Block & { type: typeof BlockType.COURSES; content: CoursesBlockContent })
  | (Block & {
      type: typeof BlockType.MARINE_LIFE
      content: MarineLifeBlockContent
    })
