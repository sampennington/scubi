import { BlockType } from "@/database/schema"
import {
  defaultHeroContent,
  defaultTextContent,
  defaultImageContent,
  defaultDividerContent,
  defaultMultiColumnContent,
  defaultGalleryContent,
  defaultTestimonialsContent,
  defaultTeamContent,
  defaultFAQContent,
  defaultContactFormContent,
  defaultCallToActionContent,
  defaultVideoContent,
  defaultMapContent,
  defaultSocialFeedContent,
  defaultTwoColumnContent,
  defaultCoursesContent,
  defaultMarineLifeContent
} from "@/components/blocks/default-data"
import {
  isMultiColumnContent,
  isHeroContent,
  isImageContent,
  isTextContent,
  isGalleryContent,
  isTestimonialsContent,
  isTeamContent,
  isFAQContent,
  isContactFormContent,
  isCallToActionContent,
  isVideoContent,
  isMapContent,
  isSocialFeedContent,
  isTwoColumnContent,
  isCoursesContent,
  isMarineLifeContent,
  isDividerContent
} from "./schemas"
import { Block } from "@/lib/api"

export function getRequiredFields(blockType: string) {
  switch (blockType) {
    case BlockType.HERO:
      return ["title", "text", "image", "primaryButton"]
    case BlockType.TEXT:
      return ["text"]
    case BlockType.IMAGE:
      return ["src", "alt"]
    case BlockType.MULTI_COLUMN:
      return ["title", "columns"]
    case BlockType.GALLERY:
      return ["title", "images"]
    case BlockType.TESTIMONIALS:
      return ["title", "testimonials"]
    case BlockType.TEAM:
      return ["title", "members"]
    case BlockType.FAQ:
      return ["title", "items"]
    case BlockType.CONTACT_FORM:
      return ["title", "description", "email"]
    case BlockType.CALL_TO_ACTION:
      return ["title", "text", "buttonText", "buttonUrl"]
    case BlockType.VIDEO:
      return ["title", "description", "url"]
    case BlockType.MAP:
      return ["title", "address"]
    case BlockType.SOCIAL_FEED:
      return ["title", "platform", "username"]
    case BlockType.DIVIDER:
      return []
    case BlockType.TWO_COLUMN:
      return ["title", "leftContent", "rightContent"]
    case BlockType.COURSES:
      return ["title", "courses"]
    case BlockType.MARINE_LIFE:
      return ["title", "species"]
    default:
      return []
  }
}

export const getDefaultContent = (blockType: string) => {
  switch (blockType) {
    case BlockType.HERO:
      return defaultHeroContent
    case BlockType.TEXT:
      return defaultTextContent
    case BlockType.IMAGE:
      return defaultImageContent
    case BlockType.DIVIDER:
      return defaultDividerContent
    case BlockType.MULTI_COLUMN:
      return defaultMultiColumnContent
    case BlockType.GALLERY:
      return defaultGalleryContent
    case BlockType.TESTIMONIALS:
      return defaultTestimonialsContent
    case BlockType.TEAM:
      return defaultTeamContent
    case BlockType.FAQ:
      return defaultFAQContent
    case BlockType.CONTACT_FORM:
      return defaultContactFormContent
    case BlockType.CALL_TO_ACTION:
      return defaultCallToActionContent
    case BlockType.VIDEO:
      return defaultVideoContent
    case BlockType.MAP:
      return defaultMapContent
    case BlockType.SOCIAL_FEED:
      return defaultSocialFeedContent
    case BlockType.TWO_COLUMN:
      return defaultTwoColumnContent
    case BlockType.COURSES:
      return defaultCoursesContent
    case BlockType.MARINE_LIFE:
      return defaultMarineLifeContent
    default:
      return {}
  }
}

export const getBlockPreview = (block: Block): string => {
  const { type, content } = block
  if (typeof content !== "object" || content === null) {
    return "No content"
  }

  switch (type) {
    case BlockType.TEXT:
      return isTextContent(content) ? content.text : "No text"

    case BlockType.HERO:
      return isHeroContent(content) ? content.title : "No title"

    case BlockType.IMAGE:
      return isImageContent(content) ? content.alt : "No alt text"

    case BlockType.MULTI_COLUMN:
      return isMultiColumnContent(content)
        ? `${content.columns?.length || 0} columns`
        : "No columns"

    case BlockType.GALLERY:
      return isGalleryContent(content)
        ? `${content.images?.length || 0} images`
        : "No images"

    case BlockType.TESTIMONIALS:
      return isTestimonialsContent(content)
        ? `${content.testimonials?.length || 0} testimonials`
        : "No testimonials"

    case BlockType.TEAM:
      return isTeamContent(content)
        ? `${content.members?.length || 0} members`
        : "No members"

    case BlockType.FAQ:
      return isFAQContent(content)
        ? `${content.items?.length || 0} items`
        : "No items"

    case BlockType.CONTACT_FORM:
      return isContactFormContent(content)
        ? `${content.fields?.length || 0} fields`
        : "No fields"

    case BlockType.CALL_TO_ACTION:
      return isCallToActionContent(content) ? content.title : "No title"

    case BlockType.VIDEO:
      return isVideoContent(content)
        ? `Video: ${content.videoUrl || "No URL"}`
        : "No video URL"

    case BlockType.MAP:
      return isMapContent(content)
        ? `Map: ${content.address || "No address"}`
        : "No address"

    case BlockType.SOCIAL_FEED:
      return isSocialFeedContent(content)
        ? `${content.platform || "Unknown"}: ${content.username || "No username"}`
        : "No platform or username"

    case BlockType.DIVIDER:
      return isDividerContent(content) ? content.text || "Divider" : "No text"

    case BlockType.TWO_COLUMN:
      return isTwoColumnContent(content) ? "Two column layout" : "No layout"

    case BlockType.COURSES:
      return isCoursesContent(content)
        ? `${content.courses?.length || 0} courses`
        : "No courses"

    case BlockType.MARINE_LIFE:
      return isMarineLifeContent(content)
        ? `${content.items?.length || 0} items`
        : "No items"

    default:
      return "No preview available"
  }
}
