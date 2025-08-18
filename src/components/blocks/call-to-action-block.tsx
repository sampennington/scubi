import Image from "next/image"
import { Button } from "../ui/button"
import type { CallToActionContent } from "@/components/blocks/schemas"

const defaultContent: CallToActionContent = {
  title: "Set your call to action title here",
  primaryButton: {
    label: "Get Started",
    url: "#",
    variant: "secondary"
  }
}

export const CallToActionBlock = ({
  content = defaultContent
}: {
  content?: CallToActionContent
}) => {
  const {
    title,
    description,
    primaryButton,
    secondaryButton,
    backgroundImage,
    backgroundColor,
    textColor,
    alignment = "center"
  } = content

  const textAlignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }

  return (
    <section
      className="relative py-20"
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image src={backgroundImage} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4">
        <div className={`mx-auto max-w-4xl ${textAlignment[alignment]}`}>
          <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">{title}</h2>

          {description && <p className="mb-8 text-xl ">{description}</p>}

          <div
            className={`flex gap-4 ${alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start"}`}
          >
            <Button size="lg" variant={primaryButton.variant} asChild>
              <a href={primaryButton.url}>{primaryButton.label}</a>
            </Button>

            {secondaryButton && (
              <Button size="lg" variant={secondaryButton.variant} asChild>
                <a href={secondaryButton.url}>{secondaryButton.label}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
