import Image from "next/image"
import { Calendar, Phone } from "lucide-react"
import heroImage from "@/assets/hero-underwater.jpg"
import type { HeroContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

import {
  BlockEditProvider,
  useBlockEdit
} from "@/components/ui/block-edit-context"
import { E } from "@/components/ui/edit-with-context"

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

const HeroBlockContent = () => {
  const { isSaving, content } = useBlockEdit<HeroContent>()

  return (
    <section className="relative w-full overflow-hidden py-20">
      <div className="absolute inset-0 z-0">
        <Image
          src={content.image}
          alt="Underwater scene"
          className="h-full w-full object-cover"
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="max-w-3xl text-white">
          <E.h1
            fieldPath="title"
            className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl"
          >
            {content.title}
          </E.h1>

          <E.p fieldPath="text" className="mb-8 text-xl">
            {content.text}
          </E.p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <E.button
              fieldPath="primaryButton.label"
              icon={<Calendar className="mr-2 h-5 w-5" />}
              variant={content.primaryButton.variant}
              size="lg"
            >
              {content.primaryButton.label}
            </E.button>
            <E.button
              fieldPath="secondaryButton.label"
              icon={<Phone className="mr-2 h-5 w-5" />}
              variant={content.secondaryButton.variant}
              size="lg"
            >
              {content.secondaryButton.label}
            </E.button>
          </div>

          {isSaving && (
            <div className="absolute top-4 right-4 rounded bg-black/50 px-2 py-1 text-sm text-white">
              Saving...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const HeroBlockPreview = ({ content }: { content: HeroContent }) => {
  return (
    <section className="relative w-full overflow-hidden py-20">
      <div className="absolute inset-0 z-0">
        <Image
          src={content.image}
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
            {content.title}
          </h1>

          <p className="mb-8 text-xl">{content.text}</p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-md rounded-md bg-secondary px-8 font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {content.primaryButton.label}
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-md rounded-md bg-white px-8 font-medium text-black ring-offset-background transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Phone className="mr-2 h-5 w-5" />
              {content.secondaryButton.label}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export const HeroBlock = ({
  content = defaultContent,
  blockId
}: {
  content?: HeroContent
  blockId?: string
}) => {
  if (!blockId) {
    return <HeroBlockPreview content={content} />
  }

  return (
    <BlockEditProvider<HeroContent> blockId={blockId} initialContent={content}>
      <HeroBlockContent />
    </BlockEditProvider>
  )
}
