import type { TextContent } from "../../shared/schemas"
import { defaultTextContent } from "./defaults"

export const TextBlock = ({ content = defaultTextContent }: { content?: TextContent }) => {
  const { text } = content

  return <div className="text-left text-block">{text}</div>
}
