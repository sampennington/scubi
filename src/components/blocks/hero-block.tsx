import Image from "next/image"
import { Button } from "../ui/button"
import { Calendar, Phone } from "lucide-react"
import heroImage from "@/assets/hero-underwater.jpg"
import type { HeroContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

const defaultContent: HeroContent = {
  title: "Set your title here",
  text: "Set your text here",
  image: heroImage.src,
  primaryButton: {
    label: "Set your button label here",
    url: "",
    variant: "secondary"
  },
  secondaryButton: {
    label: "Set your secondary button here",
    url: "",
    variant: "invert"
  }
}

export const HeroBlock = ({
  content = defaultContent
}: {
  content?: HeroContent
}) => {
  const { title, text, primaryButton, secondaryButton, image } = content

  return (
    <>
      <section className="relative w-full overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt="Underwater scene"
            className="h-full w-full object-cover"
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="max-w-3xl text-white">
            <h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mb-8 text-xl">{text}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant={primaryButton.variant}>
                <Calendar className="mr-2 h-5 w-5" />
                {primaryButton.label}
              </Button>
              <Button size="lg" variant={secondaryButton.variant}>
                <Phone className="mr-2 h-5 w-5" />
                {secondaryButton.label}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
