import type { HeroContent } from "./hero.schema"

export const defaultHeroContent: HeroContent = {
  title: "Discover the Underwater World",
  text: "Professional dive training and unforgettable underwater adventures await. From beginner courses to advanced certifications, explore the ocean's wonders with our expert instructors.",
  image: "",
  logo: "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500",
  logoUrl: "/",
  announcement: "New PADI Advanced Open Water courses starting soon!",
  announcementUrl: "#",
  primaryButton: {
    label: "Book a Dive",
    url: "#",
    variant: "primary"
  },
  secondaryButton: {
    label: "View Courses", 
    url: "#",
    variant: "outline"
  },
  alignment: "center",
  minHeight: 60,
  navigation: [
    { name: "Courses", href: "#" },
    { name: "Dive Trips", href: "#" },
    { name: "Equipment", href: "#" },
    { name: "About Us", href: "#" }
  ],
  loginText: "Log in",
  loginUrl: "#",
  showNavigation: true,
  showLogin: true
}
