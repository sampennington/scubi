import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from "@heroicons/react/20/solid"
import type { ContentStickyContent } from "./content-sticky.schema"
import { defaultContentStickyContent } from "./content-sticky.default"
import type { Block } from "@/lib/api"
import { BlockEditProvider, useBlockEdit } from "@/components/blocks/editable/context"
import { E } from "@/components/blocks/editable/editable"
import { DynamicSettings } from "@/components/blocks/shared/dynamic-settings"
import { blockRegistry } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import { applyBackgroundWithExisting } from "@/components/blocks/shared/background"

export interface ContentStickyBlockProps extends Block {
  content: ContentStickyContent
}

const iconMap = {
  "cloud-arrow-up": CloudArrowUpIcon,
  "lock-closed": LockClosedIcon,
  server: ServerIcon
}

const ContentStickyBlockContent = () => {
  const { content, handleEdit } = useBlockEdit<ContentStickyContent>()

  const blockConfig = blockRegistry.get("content-sticky")

  if (!blockConfig) {
    return null
  }

  const {
    eyebrow,
    title,
    subtitle,
    image,
    imageAlt,
    background,
    content: mainContent,
    features,
    bottomTitle,
    bottomContent
  } = { ...defaultContentStickyContent, ...content }

  const backgroundProps = applyBackgroundWithExisting(background || { type: "none" }, "bg-gray-900")

  return (
    <div className="group relative">
      <DynamicSettings
        config={blockConfig.settings}
        value={content}
        onChange={handleEdit}
        title={`${blockConfig.name} Settings`}
      />

      <div
        className={cn(
          "relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0",
          backgroundProps.className
        )}
        style={backgroundProps.style}
      >
        <div className="-z-10 absolute inset-0 overflow-hidden">
          <svg
            aria-hidden="true"
            className="-translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] absolute top-0 left-[max(50%,25rem)] h-256 w-512 stroke-gray-800"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width="200"
                height="200"
                x="50%"
                y="-1"
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="-1" className="overflow-visible fill-gray-800/50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth="0"
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              strokeWidth="0"
            />
          </svg>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <E.p fieldPath="eyebrow" className="font-semibold text-base/7 text-indigo-400">
                  {eyebrow}
                </E.p>
                <E.h1
                  fieldPath="title"
                  className="mt-2 text-pretty font-semibold text-4xl text-white tracking-tight sm:text-5xl"
                >
                  {title}
                </E.h1>
                <E.p fieldPath="subtitle" className="mt-6 text-gray-300 text-xl/8">
                  {subtitle}
                </E.p>
              </div>
            </div>
          </div>

          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <E.image
              fieldPath="image"
              src={image}
              alt={imageAlt}
              className="w-3xl max-w-none rounded-xl bg-gray-800 shadow-xl ring-1 ring-white/10 sm:w-228"
              width={912}
              height={684}
            />
          </div>

          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 text-gray-400 lg:max-w-lg">
                <E.p fieldPath="content">{mainContent}</E.p>

                <ul className="mt-8 space-y-8 text-gray-400">
                  {features.map((feature, index) => {
                    const IconComponent =
                      iconMap[feature.icon as keyof typeof iconMap] || CloudArrowUpIcon
                    return (
                      <li key={index} className="flex gap-x-3">
                        <IconComponent
                          aria-hidden="true"
                          className="mt-1 size-5 flex-none text-indigo-400"
                        />
                        <span>
                          <E.span
                            fieldPath={`features[${index}].title`}
                            className="font-semibold text-white"
                          >
                            {feature.title}
                          </E.span>{" "}
                          <E.span fieldPath={`features[${index}].description`}>
                            {feature.description}
                          </E.span>
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <E.p fieldPath="bottomContent" className="mt-8">
                  {bottomContent}
                </E.p>

                <E.h2
                  fieldPath="bottomTitle"
                  className="mt-16 font-bold text-2xl text-white tracking-tight"
                >
                  {bottomTitle}
                </E.h2>

                <E.p fieldPath="bottomContent" className="mt-6">
                  {bottomContent}
                </E.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ContentStickyBlock = (props: ContentStickyBlockProps) => {
  return (
    <BlockEditProvider {...props}>
      <ContentStickyBlockContent />
    </BlockEditProvider>
  )
}
