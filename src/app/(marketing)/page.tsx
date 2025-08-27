import { BenefitsSection } from "@/components/layout/sections/benefits"
import { ContactSection } from "@/components/layout/sections/contact"
import { FAQSection } from "@/components/layout/sections/faq"
import { FeaturesSection } from "@/components/layout/sections/features"
import { HeroSection } from "@/components/layout/sections/hero"
import { PricingSection } from "@/components/layout/sections/pricing"
import { ServicesSection } from "@/components/layout/sections/services"
import { TestimonialSection } from "@/components/layout/sections/testimonial"
import { site } from "@/config/site"

export const metadata = {
  title: "Scubi - Turn Your Dive Shop's Website into a Modern Booking Machine",
  description:
    "Just paste your current website link — or start from scratch. Scubi instantly builds a faster, better-looking, mobile-friendly site — designed to bring in more divers.",
  openGraph: {
    type: "website",
    url: site.url,
    title: "Scubi - Turn Your Dive Shop's Website into a Modern Booking Machine",
    description:
      "Just paste your current website link — or start from scratch. Scubi instantly builds a faster, better-looking, mobile-friendly site — designed to bring in more divers.",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 750,
        alt: "Scubi - Dive Shop Website Builder"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: site.url,
    title: "Scubi - Turn Your Dive Shop's Website into a Modern Booking Machine",
    description:
      "Just paste your current website link — or start from scratch. Scubi instantly builds a faster, better-looking, mobile-friendly site — designed to bring in more divers.",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 750,
        alt: "Scubi - Dive Shop Website Builder"
      }
    ]
  }
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
    </>
  )
}
