import type { StatsContent } from "./stats.schema"
import { defaultStatsContent } from "./stats.default"
import type { Block } from "@/lib/api"
import { BlockEditProvider, useBlockEdit } from "@/components/blocks/editable/context"
import { E } from "@/components/blocks/editable/editable"
import { cn } from "@/lib/utils"
import { DynamicSettings } from "@/components/blocks/shared/dynamic-settings"
import { blockRegistry } from "@/lib/blocks"
import { applyBackgroundWithExisting } from "@/components/blocks/shared/background"

export interface StatsBlockProps extends Block {
  content: StatsContent
}

const StatsBlockContent = () => {
  const { content, handleEdit } = useBlockEdit<StatsContent>()

  const blockConfig = blockRegistry.get("stats")

  if (!blockConfig) {
    return null
  }

  const {
    title,
    description,
    stats,
    layout,
    columns,
    background,
    backgroundColor,
    textColor,
    alignment
  } = {
    ...defaultStatsContent,
    ...content
  }

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left":
        return "text-left"
      case "right":
        return "text-right"
      default:
        return "text-center"
    }
  }

  const getGridColsClass = () => {
    switch (columns) {
      case "2":
        return "lg:grid-cols-2"
      case "4":
        return "lg:grid-cols-4"
      default:
        return "lg:grid-cols-3"
    }
  }

  // Use new background system or fallback to legacy backgroundColor
  const finalBackground =
    background ||
    (backgroundColor
      ? { type: "color" as const, color: backgroundColor }
      : { type: "color" as const, color: "#111827" })

  const backgroundProps = applyBackgroundWithExisting(finalBackground)

  const textStyle = textColor ? { color: textColor } : { color: "#ffffff" }

  return (
    <div className="group relative">
      <DynamicSettings
        config={blockConfig.settings}
        value={content}
        onChange={handleEdit}
        title={`${blockConfig.name} Settings`}
      />

      <div
        className={cn("py-24 sm:py-32", backgroundProps.className)}
        style={backgroundProps.style}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {(title || description) && (
            <div className={cn("mx-auto max-w-2xl", getAlignmentClasses())}>
              {title && (
                <E.h2
                  fieldPath="title"
                  className="font-bold text-3xl tracking-tight sm:text-4xl"
                  style={textStyle}
                >
                  {title}
                </E.h2>
              )}
              {description && (
                <E.p
                  fieldPath="description"
                  className="mt-6 text-gray-300 text-lg leading-8"
                  style={textStyle}
                >
                  {description}
                </E.p>
              )}
            </div>
          )}

          <dl
            className={cn(
              "mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16",
              getAlignmentClasses(),
              layout === "horizontal"
                ? "lg:max-w-none lg:grid-cols-4"
                : `lg:max-w-none ${getGridColsClass()}`
            )}
          >
            {stats.map((stat, index) => (
              <div key={index} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base/7 text-gray-400">
                  <E.span fieldPath={`stats[${index}].label`}>{stat.label}</E.span>
                </dt>
                <dd
                  className="order-first font-semibold text-3xl text-white tracking-tight sm:text-5xl"
                  style={textStyle}
                >
                  <E.span fieldPath={`stats[${index}].value`}>{stat.value}</E.span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export const StatsBlock = (props: StatsBlockProps) => {
  return (
    <BlockEditProvider {...props}>
      <StatsBlockContent />
    </BlockEditProvider>
  )
}
