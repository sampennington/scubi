import type { Block } from "@/lib/api"
import { BlockType } from "@/database/schema"

import { EmptyPagePlaceholder } from "./empty-page-placeholder"
import {
  isHeroContent,
  isTeamContent,
  isContactFormContent,
  isCoursesContent,
  type HeroContent,
  type TeamContent,
  type ContactFormContent,
  type CoursesContent,
  type ReviewsContent,
  isReviewsContent
} from "./schemas"
import { useSite } from "../../../app/preview/components/site-context"
import { defaultContent } from "./defaults-index"
import { Loader2 } from "lucide-react"

import { HeroBlock, TeamBlock, ContactFormBlock, CoursesBlock, ReviewsBlock } from "../"

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

      return <HeroBlock key={block.id} {...block} content={content} />
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

    default:
      console.warn(`Unknown block type: ${block.type}`)
      return null
  }
}
