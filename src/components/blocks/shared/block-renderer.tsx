import type { Block } from "@/lib/api"
import { BlockType } from "@/database/schema"
import { TextBlock } from "../content/text"
import { ImageBlock } from "../content/image"
// import { HeroBlock } from "../../editable/blocks/hero/hero-block"
import { EditableHeroBlock } from "../../editable/blocks/hero/hero-block-new"

import { MultiColumnBlock } from "../../editable/blocks/multi-column/multi-column-block"
import { GalleryBlock } from "../content/gallery"
import { TestimonialsBlock } from "../social/testimonials"
import { TeamBlock } from "../../editable/blocks/team/team-block"
import { FAQBlock } from "../interactive/faq"
import { ContactFormBlock } from "../../editable/blocks/contact-form/contact-form-block"
import { CallToActionBlock } from "../interactive/call-to-action"
import { VideoBlock } from "../content/video"
import { MapBlock } from "../specialized/map"
import { SocialFeedBlock } from "../social/social-feed"
import { DividerBlock } from "../layout/divider"
import { TwoColumnBlock } from "../layout/two-column"
import { CoursesBlock } from "../../editable/blocks/courses/courses-block"
import { MarineLifeBlock } from "../specialized/marine-life"
import { EmptyPagePlaceholder } from "./empty-page-placeholder"
import {
  isHeroContent,
  isTextContent,
  isImageContent,
  isMultiColumnContent,
  isGalleryContent,
  isTestimonialsContent,
  isTeamContent,
  isFAQContent,
  isContactFormContent,
  isCallToActionContent,
  isVideoContent,
  isMapContent,
  isSocialFeedContent,
  isDividerContent,
  isTwoColumnContent,
  isCoursesContent,
  isMarineLifeContent,
  type HeroContent,
  type MultiColumnContent,
  type TeamContent,
  type ContactFormContent,
  type CoursesContent,
  type ReviewsContent,
  isReviewsContent
} from "./schemas"
import { useSite } from "../../../app/preview/components/site-context"
import { defaultContent } from "./defaults-index"
import { Loader2 } from "lucide-react"
import ReviewsBlock from "../../editable/blocks/reviews/reviews-block"

export const BlockRenderer = () => {
  const { blocks, isLoadingLocalBlocks } = useSite()

  if (isLoadingLocalBlocks) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (blocks.length === 0) {
    return <EmptyPagePlaceholder />
  }

  return (
    <div className="flex w-full flex-col">
      {blocks.map((block) => (
        <div key={block.id}>
          <BlockWithValidation block={block} />
        </div>
      ))}
    </div>
  )
}

function BlockWithValidation({ block }: { block: Block }) {
  switch (block.type) {
    case BlockType.HERO: {
      const content = isHeroContent(block.content)
        ? block.content
        : (defaultContent[BlockType.HERO] as HeroContent)

      // Use editable version if available, otherwise fall back to template
      return <EditableHeroBlock key={block.id} {...block} content={content} />
    }

    case BlockType.MULTI_COLUMN: {
      const content = isMultiColumnContent(block.content)
        ? block.content
        : (defaultContent[BlockType.MULTI_COLUMN] as MultiColumnContent)

      return <MultiColumnBlock key={block.id} {...block} content={content} />
    }

    case BlockType.TEAM: {
      const content = isTeamContent(block.content)
        ? block.content
        : (defaultContent[BlockType.TEAM] as TeamContent)

      return <TeamBlock key={block.id} {...block} content={content} />
    }

    case BlockType.CONTACT_FORM: {
      const content = isContactFormContent(block.content)
        ? block.content
        : (defaultContent[BlockType.CONTACT_FORM] as ContactFormContent)

      return <ContactFormBlock key={block.id} {...block} content={content} />
    }

    case BlockType.COURSES: {
      const content = isCoursesContent(block.content)
        ? block.content
        : (defaultContent[BlockType.COURSES] as CoursesContent)

      return <CoursesBlock key={block.id} {...block} content={content} />
    }

    case BlockType.REVIEWS: {
      const content = isReviewsContent(block.content)
        ? block.content
        : (defaultContent[BlockType.REVIEWS] as ReviewsContent)

      return <ReviewsBlock key={block.id} {...block} content={content} />
    }

    // Non editable blocks
    case BlockType.TEXT: {
      if (isTextContent(block.content)) {
        return <TextBlock key={block.id} content={block.content} />
      }
      return <TextBlock key={block.id} />
    }

    case BlockType.IMAGE: {
      if (isImageContent(block.content)) {
        return <ImageBlock key={block.id} content={block.content} />
      }
      return <ImageBlock key={block.id} />
    }

    case BlockType.GALLERY: {
      if (isGalleryContent(block.content)) {
        return <GalleryBlock key={block.id} content={block.content} />
      }
      return <GalleryBlock key={block.id} />
    }

    case BlockType.TESTIMONIALS: {
      if (isTestimonialsContent(block.content)) {
        return <TestimonialsBlock key={block.id} content={block.content} />
      }
      return <TestimonialsBlock key={block.id} />
    }

    case BlockType.FAQ: {
      if (isFAQContent(block.content)) {
        return <FAQBlock key={block.id} content={block.content} />
      }
      return <FAQBlock key={block.id} />
    }

    case BlockType.CALL_TO_ACTION: {
      if (isCallToActionContent(block.content)) {
        return <CallToActionBlock key={block.id} content={block.content} />
      }
      return <CallToActionBlock key={block.id} />
    }

    case BlockType.VIDEO: {
      if (isVideoContent(block.content)) {
        return <VideoBlock key={block.id} content={block.content} />
      }
      return <VideoBlock key={block.id} />
    }

    case BlockType.MAP: {
      if (isMapContent(block.content)) {
        return <MapBlock key={block.id} content={block.content} />
      }
      return <MapBlock key={block.id} />
    }

    case BlockType.SOCIAL_FEED: {
      if (isSocialFeedContent(block.content)) {
        return <SocialFeedBlock key={block.id} content={block.content} />
      }
      return <SocialFeedBlock key={block.id} />
    }

    case BlockType.DIVIDER: {
      if (isDividerContent(block.content)) {
        return <DividerBlock key={block.id} content={block.content} />
      }
      return <DividerBlock key={block.id} />
    }

    case BlockType.TWO_COLUMN: {
      if (isTwoColumnContent(block.content)) {
        return <TwoColumnBlock key={block.id} content={block.content} />
      }
      return <TwoColumnBlock key={block.id} />
    }

    case BlockType.MARINE_LIFE: {
      if (isMarineLifeContent(block.content)) {
        return <MarineLifeBlock key={block.id} content={block.content} />
      }
      return <MarineLifeBlock key={block.id} />
    }

    default:
      console.warn(`Unknown block type: ${block.type}`)
      return null
  }
}
