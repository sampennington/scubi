import type { ImageBlockContent } from "./types"
import Image from "next/image"

export const ImageBlock = ({ content }: { content: ImageBlockContent }) => {
  return (
    <div className="image-block">
      <Image src={content.src} alt={content.alt} width={100} height={100} />
      {content.caption && <p className="caption">{content.caption}</p>}
    </div>
  )
}
