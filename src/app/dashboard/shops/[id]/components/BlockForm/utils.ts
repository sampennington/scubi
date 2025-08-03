import { BlockType } from "@/database/schema"

export const getRequiredFields = (blockType: string) => {
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
