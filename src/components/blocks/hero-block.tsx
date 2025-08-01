import Image from "next/image"
import type { HeroBlockContent } from "./types"
import { Button } from "../ui/button"
import { Calendar, Phone } from "lucide-react"

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
            <h1 className="mb-6 font-bold text-5xl md:text-6xl">
              {content.title}
            </h1>
            <p className="mb-8 text-white/90 text-xl md:text-2xl">
              {content.description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="secondary">
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
