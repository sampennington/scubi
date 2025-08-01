import Image from "next/image"
import type { HeroBlockContent } from "./types"

export const HeroBlock = ({ content }: { content: HeroBlockContent }) => {
  return (
    <div className="hero-block">
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      {content.image && <Image src={content.image} alt={content.title} />}
    </div>
  )
}
