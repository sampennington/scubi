import type { Block } from "@/lib/api"
import { BlockType } from "@/database/schema"
import { TextBlock } from "./text-block"
import { ImageBlock } from "./image-block"
import { HeroBlock } from "./hero-block"
import { MultiColumnBlock } from "./multi-column-block"
import { GalleryBlock } from "./gallery-block"
import { TestimonialsBlock } from "./testimonials-block"
import { TeamBlock } from "./team-block"
import { FAQBlock } from "./faq-block"
import { ContactFormBlock } from "./contact-form-block"
import { CallToActionBlock } from "./call-to-action-block"
import { VideoBlock } from "./video-block"
import { MapBlock } from "./map-block"
import { SocialFeedBlock } from "./social-feed-block"
import { DividerBlock } from "./divider-block"
import { TwoColumnBlock } from "./two-column-block"
import { CoursesBlock } from "./courses-block"
import { MarineLifeBlock } from "./marine-life-block"
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
  isMarineLifeContent
} from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

export const BlockRenderer = ({ blocks }: { blocks: Block[] }) => {
  const sortedBlocks = blocks.sort((a, b) => (a.order || 99) - (b.order || 99))

  return (
    <div className="flex w-full flex-col">
      {sortedBlocks.map((block) => (
        <BlockWithValidation key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockWithValidation({ block }: { block: Block }) {
  switch (block.type) {
    case BlockType.HERO: {
      if (isHeroContent(block.content)) {
        return <HeroBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.TEXT: {
      if (isTextContent(block.content)) {
        return <TextBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.IMAGE: {
      if (isImageContent(block.content)) {
        return <ImageBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.MULTI_COLUMN: {
      if (isMultiColumnContent(block.content)) {
        return <MultiColumnBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.GALLERY: {
      if (isGalleryContent(block.content)) {
        return <GalleryBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.TESTIMONIALS: {
      if (isTestimonialsContent(block.content)) {
        return <TestimonialsBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.TEAM: {
      if (isTeamContent(block.content)) {
        return <TeamBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.FAQ: {
      if (isFAQContent(block.content)) {
        return <FAQBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.CONTACT_FORM: {
      if (isContactFormContent(block.content)) {
        return <ContactFormBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.CALL_TO_ACTION: {
      if (isCallToActionContent(block.content)) {
        return <CallToActionBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.VIDEO: {
      if (isVideoContent(block.content)) {
        return <VideoBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.MAP: {
      if (isMapContent(block.content)) {
        return <MapBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.SOCIAL_FEED: {
      if (isSocialFeedContent(block.content)) {
        return <SocialFeedBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.DIVIDER: {
      if (isDividerContent(block.content)) {
        return <DividerBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.TWO_COLUMN: {
      if (isTwoColumnContent(block.content)) {
        return <TwoColumnBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.COURSES: {
      if (isCoursesContent(block.content)) {
        return <CoursesBlock key={block.id} content={block.content} />
      }
      break
    }

    case BlockType.MARINE_LIFE: {
      if (isMarineLifeContent(block.content)) {
        return <MarineLifeBlock key={block.id} content={block.content} />
      }
      break
    }

    default:
      console.warn(`Unknown block type: ${block.type}`)
      return null
  }
}
