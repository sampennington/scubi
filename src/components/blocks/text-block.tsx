import type { TextContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

export const TextBlock = ({ content }: { content: TextContent }) => {
  return (
    <div className={`text-block text-${content.alignment || "left"}`}>
      {content.text}
    </div>
  )
}
