import type { TextBlockContent } from "./types"

export const TextBlock = ({ content }: { content: TextBlockContent }) => {
  return (
    <div className={`text-block text-${content.alignment || "left"}`}>
      {content.text}
    </div>
  )
}
