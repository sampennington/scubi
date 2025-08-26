import type { HeroContent } from "../../shared/schemas"

export const defaultHeroContent: HeroContent = {
  title: "Welcome to our site",
  text: "Discover amazing experiences with us",
  image: "/demo-img.png",
  primaryButton: {
    label: "Get Started",
    url: "#",
    variant: "secondary"
  },
  secondaryButton: {
    label: "Learn More",
    url: "#",
    variant: "outline"
  }
}
