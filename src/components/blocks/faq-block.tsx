"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { FAQContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

const defaultContent: FAQContent = {
  title: "Set your FAQ title here",
  items: [
    {
      question: "Frequently asked question?",
      answer: "This is the answer to the question."
    }
  ]
}

export const FAQBlock = ({
  content = defaultContent
}: {
  content?: FAQContent
}) => {
  const {
    title,
    description,
    items = [],
    layout = "accordion",
    allowMultipleOpen = false
  } = content

  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (allowMultipleOpen) {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <section className="py-16">
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

        {layout === "accordion" && (
          <div className="mx-auto max-w-3xl space-y-4">
            {(items || []).map((item, index) => (
              <div key={index} className="rounded-lg border bg-card">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="font-semibold">{item.question}</h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {openItems.includes(index) && (
                  <div className="border-t px-6 py-4">
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === "list" && (
          <div className="mx-auto max-w-4xl space-y-8">
            {(items || []).map((item, index) => (
              <div key={index} className="rounded-lg bg-card p-6">
                <h3 className="mb-3 font-semibold text-xl">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
