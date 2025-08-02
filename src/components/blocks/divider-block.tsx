import type { DividerBlockContent } from "./types"

export const DividerBlock = ({ content }: { content: DividerBlockContent }) => {
  const {
    text,
    alignment = "center",
    style = "solid",
    color,
    thickness = 1
  } = content

  const borderStyles = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted"
  }

  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center gap-4 ${alignmentClasses[alignment]}`}
        >
          <div
            className={`flex-1 border-t ${borderStyles[style]}`}
            style={{
              borderColor: color || undefined,
              borderWidth: `${thickness}px`
            }}
          />

          {text && (
            <span
              className="px-4 text-muted-foreground"
              style={{ color: color || undefined }}
            >
              {text}
            </span>
          )}

          {text && (
            <div
              className={`flex-1 border-t ${borderStyles[style]}`}
              style={{
                borderColor: color || undefined,
                borderWidth: `${thickness}px`
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
