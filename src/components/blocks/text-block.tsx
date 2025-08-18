import type { TextContent } from "@/components/blocks/schemas"

const defaultContent: TextContent = {
  text: "Set your text here"
}

export const TextBlock = ({ content = defaultContent }: { content?: TextContent }) => {
  const { text } = content

  return <div className="text-block text-left">{text}</div>
}
