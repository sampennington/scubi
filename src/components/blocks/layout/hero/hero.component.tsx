import { useState } from "react"
import { Dialog, DialogPanel } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import type { HeroContent } from "./hero.schema"
import { defaultHeroContent } from "./hero.default"
import type { Block } from "@/lib/api"
import { BlockEditProvider, useBlockEdit } from "@/components/blocks/editable/context"
import { E } from "@/components/blocks/editable/editable"
import { cn } from "@/lib/utils"
import { DynamicSettings } from "@/components/blocks/shared/dynamic-settings"
import { blockRegistry } from "@/lib/blocks"

export interface HeroBlockProps extends Block {
  content: HeroContent
}

const HeroBlockContent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { content, handleEdit } = useBlockEdit<HeroContent>()

  const blockConfig = blockRegistry.get("hero")

  if (!blockConfig) {
    return null
  }

  const {
    title,
    text,
    image,
    logo,
    logoUrl,
    primaryButton,
    secondaryButton,
    alignment,
    minHeight,
    navigation,
    loginText,
    loginUrl,
    showNavigation,
    showLogin
  } = { ...defaultHeroContent, ...content }

  const containerStyle = {
    minHeight: `${minHeight}vh`
  }

  const backgroundStyle = image
    ? {
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.8)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    : {}

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

  const getButtonVariantClasses = (variant: string) => {
    switch (variant) {
      case "primary":
        return "rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      case "secondary":
        return "rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500"
      case "outline":
        return "text-sm/6 font-semibold text-white border border-white/20 rounded-md px-3.5 py-2.5 hover:bg-white/10"
      case "ghost":
        return "text-sm/6 font-semibold text-white hover:bg-white/10 rounded-md px-3.5 py-2.5"
      default:
        return "text-sm/6 font-semibold text-white"
    }
  }

  return (
    <div className="group relative">
      <DynamicSettings
        config={blockConfig.settings}
        value={content}
        onChange={handleEdit}
        title={`${blockConfig.name} Settings`}
      />

      <div className={cn("bg-gray-900")} style={backgroundStyle}>
        <header className="absolute inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center p-6 lg:px-8">
            {logo && (
              <div className="flex lg:flex-1">
                <a href={logoUrl} className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <E.image
                    fieldPath="logo"
                    src={logo}
                    alt="Company Logo"
                    className="h-8 w-auto"
                    width={32}
                    height={32}
                  />
                </a>
              </div>
            )}

            {showNavigation && navigation && navigation.length > 0 && (
              <>
                <div className="flex lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-12">
                  {navigation.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="font-semibold text-sm/6 text-white"
                    >
                      <E.span fieldPath={`navigation[${index}].name`}>{item.name}</E.span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </nav>

          {showNavigation && navigation && navigation.length > 0 && (
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
              <div className="fixed inset-0 z-50" />
              <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                <div className="flex items-center justify-between">
                  <a href={logoUrl} className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    {logo && (
                      <E.image
                        fieldPath="logo"
                        src={logo}
                        alt="Company Logo"
                        className="h-8 w-auto"
                        width={32}
                        height={32}
                      />
                    )}
                  </a>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-md p-2.5 text-gray-200"
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-white/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item, index) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 font-semibold text-base/7 text-white hover:bg-white/5"
                        >
                          <E.span fieldPath={`navigation[${index}].name`}>{item.name}</E.span>
                        </a>
                      ))}
                    </div>
                    {showLogin && loginText && loginUrl && (
                      <div className="py-6">
                        <a
                          href={loginUrl}
                          className="-mx-3 block rounded-lg px-3 py-2.5 font-semibold text-base/7 text-white hover:bg-white/5"
                        >
                          <E.span fieldPath="loginText">{loginText}</E.span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </Dialog>
          )}
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="-top-40 -z-10 sm:-top-80 absolute inset-x-0 transform-gpu overflow-hidden blur-3xl"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              }}
              className="-translate-x-1/2 relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56" style={containerStyle}>
            <div className={getAlignmentClasses()}>
              <E.h1
                fieldPath="title"
                className="text-balance font-semibold text-5xl text-white tracking-tight sm:text-7xl"
              >
                {title}
              </E.h1>
              <E.p
                fieldPath="text"
                className="mt-8 text-pretty font-medium text-gray-400 text-lg sm:text-xl/8"
              >
                {text}
              </E.p>

              {/* Buttons */}
              <div
                className={cn(
                  "mt-10 flex items-center gap-x-6",
                  alignment === "center"
                    ? "justify-center"
                    : alignment === "right"
                      ? "justify-end"
                      : "justify-start"
                )}
              >
                {primaryButton.label && (
                  <a href={primaryButton.url}>
                    <E.button
                      fieldPath="primaryButton.label"
                      variant={primaryButton.variant}
                      className={getButtonVariantClasses(primaryButton.variant)}
                    >
                      {primaryButton.label}
                    </E.button>
                  </a>
                )}
                {secondaryButton.label && (
                  <a href={secondaryButton.url}>
                    <E.button
                      fieldPath="secondaryButton.label"
                      variant={secondaryButton.variant}
                      className={getButtonVariantClasses(secondaryButton.variant)}
                    >
                      {secondaryButton.label}
                    </E.button>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="-z-10 absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              }}
              className="-translate-x-1/2 relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const HeroBlock = (props: HeroBlockProps) => {
  return (
    <BlockEditProvider {...props}>
      <HeroBlockContent />
    </BlockEditProvider>
  )
}
