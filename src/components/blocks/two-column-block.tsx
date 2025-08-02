import Image from "next/image"
import type { TwoColumnBlockContent, TwoColumnContent } from "./types"

export const TwoColumnBlock = ({
  content
}: {
  content: TwoColumnBlockContent
}) => {
  const {
    title,
    description,
    content: columnContent,
    background,
    padding = 16
  } = content

  const {
    leftContent,
    rightContent,
    layout = "text-image",
    alignment = "center"
  } = columnContent

  const alignmentClasses = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end"
  }

  const renderContent = (
    content: TwoColumnContent["leftContent"] | TwoColumnContent["rightContent"]
  ) => {
    switch (content.type) {
      case "image":
        return (
          <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-96">
            <Image
              src={content.content}
              alt={content.title || ""}
              fill
              className="object-cover"
            />
          </div>
        )

      case "video":
        return (
          <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-96">
            <video
              src={content.content}
              controls
              className="h-full w-full object-cover"
            >
              <track kind="captions" />
            </video>
          </div>
        )

      default:
        return (
          <div>
            {content.title && (
              <h3 className="mb-4 text-2xl font-semibold">{content.title}</h3>
            )}
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground">{content.content}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: background || undefined,
        padding: `${padding}px 0`
      }}
    >
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div
          className={`grid gap-8 md:grid-cols-2 ${alignmentClasses[alignment]}`}
        >
          {layout === "text-image" && (
            <>
              <div>{renderContent(leftContent)}</div>
              <div>{renderContent(rightContent)}</div>
            </>
          )}

          {layout === "image-text" && (
            <>
              <div>{renderContent(rightContent)}</div>
              <div>{renderContent(leftContent)}</div>
            </>
          )}

          {layout === "text-text" && (
            <>
              <div>{renderContent(leftContent)}</div>
              <div>{renderContent(rightContent)}</div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
