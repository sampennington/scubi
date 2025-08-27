import type { icons } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"

interface BenefitsProps {
  icon: string
  title: string
  description: string
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Smartphone",
    title: "Mobile-Optimized Design",
    description:
      "Look great on every device — whether it's a phone, tablet, or laptop. Your dive shop website will be perfectly responsive."
  },
  {
    icon: "Navigation",
    title: "Clear Navigation",
    description:
      "Show your courses, prices, location, and contact details clearly and professionally. Easy for customers to find what they need."
  },
  {
    icon: "Search",
    title: "Get Found on Google",
    description:
      "Your site is SEO-optimized from the start — perfect for search terms like 'dive shop in [your location]'."
  },
  {
    icon: "Image",
    title: "Use Your Photos & Branding",
    description:
      "Already have images and a logo? Great. Just starting out? We've got free templates and placeholders."
  }
]

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container mx-auto px-4 py-24 sm:py-32">
      <div className="grid place-items-center lg:grid-cols-2 lg:gap-24">
        <div>
          <h2 className="mb-2 text-lg text-primary tracking-wider">Why Upgrade</h2>

          <h2 className="mb-4 font-bold text-3xl md:text-4xl">
            Why Upgrade (or Start) Your Dive Shop Website?
          </h2>
          <p className="mb-8 text-muted-foreground text-xl">
            Running a dive center is hard work. Between dive trips, gear servicing, and training
            students, your website is the last thing you want to worry about. That's where Scubi
            comes in.
          </p>
        </div>

        <div className="grid w-full gap-4 lg:grid-cols-2">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card key={title} className="group/number transition-all delay-75 hover:bg-sidebar">
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="var(--primary)"
                    className="mb-6 text-primary"
                  />
                  <span className="font-medium text-5xl text-muted-foreground/15 transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">{description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
