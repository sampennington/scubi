import type { Block } from "@/lib/api"
import type { BlockWithContent } from "./types"
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

function isBlockType<T extends Block["type"]>(
  block: Block,
  type: T
): block is Extract<BlockWithContent, { type: T }> {
  return block.type === type
}

export const BlockRenderer = ({ blocks }: { blocks: Block[] }) => {
  return (
    <div className="flex w-full flex-col">
      {blocks.map((block) => {
        if (isBlockType(block, BlockType.HERO)) {
          return <HeroBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.TEXT)) {
          return <TextBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.IMAGE)) {
          return <ImageBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.MULTI_COLUMN)) {
          return <MultiColumnBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.GALLERY)) {
          return <GalleryBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.TESTIMONIALS)) {
          return <TestimonialsBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.TEAM)) {
          return <TeamBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.FAQ)) {
          return <FAQBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.CONTACT_FORM)) {
          return <ContactFormBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.CALL_TO_ACTION)) {
          return <CallToActionBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.VIDEO)) {
          return <VideoBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.MAP)) {
          return <MapBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.SOCIAL_FEED)) {
          return <SocialFeedBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.DIVIDER)) {
          return <DividerBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.TWO_COLUMN)) {
          return <TwoColumnBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.COURSES)) {
          return <CoursesBlock key={block.id} content={block.content} />
        }

        if (isBlockType(block, BlockType.MARINE_LIFE)) {
          return <MarineLifeBlock key={block.id} content={block.content} />
        }

        return null
      })}
    </div>
  )
}
