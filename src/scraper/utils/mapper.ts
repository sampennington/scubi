import type { PageSection } from "./html"

export function mapSectionsToBlockCandidates(sections: PageSection[]) {
  const candidates: { type: string; content: unknown; sourceSectionType?: string }[] = []

  const hero = sections.find((s) => s.type === "hero")
  if (hero) {
    candidates.push({
      type: "hero",
      sourceSectionType: "hero",
      content: {
        title: hero.heading ?? "",
        text: hero.textSample ?? "",
        image: hero.images?.[0] ?? "",
        primaryButton: { label: "Learn more", url: "#", variant: "primary" },
        secondaryButton: { label: "Contact", url: "#", variant: "secondary" }
      }
    })
  }

  const gallery = sections.find((s) => s.type === "gallery")
  if (gallery?.images?.length) {
    candidates.push({
      type: "gallery",
      sourceSectionType: "gallery",
      content: {
        title: "Gallery",
        images: gallery.images.slice(0, 12).map((src) => ({ src: String(src), alt: "" })),
        layout: "grid",
        columns: "3"
      }
    })
  }

  return candidates
}


