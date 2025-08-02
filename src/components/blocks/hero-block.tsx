import Image from "next/image"
import type { HeroBlockContent } from "./types"
import { Button } from "../ui/button"
import { Calendar, Phone } from "lucide-react"
import { H1, P, Span } from "../ui/copy-tags"

export const HeroBlock = ({ content }: { content: HeroBlockContent }) => {
  return (
    <>
      <section className="relative w-full overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={content.image}
            alt="Underwater scene"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="max-w-3xl text-white">
            <H1 className="mb-6">{content.title}</H1>
            <P className="mb-8">{content.text}</P>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant={content.primaryButton.variant}>
                <Calendar className="mr-2 h-5 w-5" />
                {content.primaryButton.label}
              </Button>
              <Button size="lg" variant={content.secondaryButton.variant}>
                <Phone className="mr-2 h-5 w-5" />
                <Span>{content.secondaryButton.label}</Span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
