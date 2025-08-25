import type { ImageContent } from "../../shared/schemas"
import { defaultImageContent } from "./defaults"
import Image from "next/image"

export const ImageBlock = ({ content = defaultImageContent }: { content?: ImageContent }) => {
  return (
    <div className="image-block">
      <Image src={content.src} alt={content.alt} width={100} height={100} />
      {content.caption && <p className="caption">{content.caption}</p>}
    </div>
  )
}
