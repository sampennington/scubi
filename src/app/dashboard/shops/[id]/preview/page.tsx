import { Block } from "@/lib/api"

const exampleBlock: Block = {
  type: "hero",
  content: {
    headline: "Welcome to Blue Divers",
    subheadline: "Explore the underwater world with us",
    imageUrl: "/images/hero.jpg",
    cta: {
      text: "Book a Dive",
      url: "/book"
    },
    align: "center" // or "left", "right"
  }
}

export default function PreviewPage() {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Preview</h1>
        </div>
      </body>
    </html>
  )
}
