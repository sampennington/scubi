import type * as cheerio from "cheerio"
import { getSelector } from "./html"

export type PageSection = {
  type: string
  selector?: string
  heading?: string
  textSample?: string
  images: string[]
}

export function inferSections($: cheerio.CheerioAPI): PageSection[] {
  const sections: PageSection[] = []

  const header = $("header, nav").first()
  if (header.length) {
    sections.push({
      type: "nav",
      selector: getSelector(header as any),
      heading: header.find("h1,h2").first().text().trim(),
      images: []
    })
  }

  const hero = $("section, div")
    .filter((_, el) => {
      const t = ($(el).attr("class") ?? "").toLowerCase()
      return t.includes("hero") || $(el).find("h1").length > 0
    })
    .first()
  if (hero.length) {
    sections.push({
      type: "hero",
      selector: getSelector(hero as any),
      heading: hero.find("h1").first().text().trim(),
      images: hero
        .find("img")
        .map((_, e) => $(e).attr("src") ?? "")
        .get()
        .filter(Boolean)
    })
  }

  $("section, main > div").each((_, el) => {
    const $el = $(el)
    const cls = ($el.attr("class") ?? "").toLowerCase()
    const text = $el.text().replace(/\s+/g, " ").trim().slice(0, 200)
    const heading = $el.find("h2,h3").first().text().trim()
    const images = $el
      .find("img")
      .map((__, e) => $(e).attr("src") ?? "")
      .get()
      .filter(Boolean)

    const type = cls.includes("about")
      ? "about"
      : cls.includes("service") || /service|course/i.test(heading)
        ? "services"
        : cls.includes("gallery") || images.length >= 6
          ? "gallery"
          : /testimonials?|reviews?/i.test(heading) || cls.includes("testimonial")
            ? "testimonials"
            : /faq|questions?/i.test(heading) || cls.includes("faq")
              ? "faq"
              : /team|instructor/i.test(heading) || cls.includes("team")
                ? "team"
                : $el.find("form").length > 0 || cls.includes("contact")
                  ? "contact"
                  : cls.includes("cta") || /call to action|get started/i.test(text)
                    ? "cta"
                    : "unknown"

    sections.push({
      type,
      selector: getSelector($el as any),
      heading: heading || undefined,
      textSample: text || undefined,
      images
    })
  })

  const footer = $("footer").first()
  if (footer.length) {
    sections.push({ type: "footer", selector: getSelector(footer as any), images: [] })
  }

  return sections
}
