import type { ImageContent } from "@/components/blocks/schemas"
import Image from "next/image"

const defaultContent: ImageContent = {
  src: "",
  alt: "Set your alt text here",
  caption: "Set your caption here"
}

export const ImageBlock = ({ content = defaultContent }: { content?: ImageContent }) => {
  return (
    <div className="image-block">
      <Image src={content.src} alt={content.alt} width={100} height={100} />
      {content.caption && <p className="caption">{content.caption}</p>}
    </div>
  )
}
