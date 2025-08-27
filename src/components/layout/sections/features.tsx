import {
  RiShieldKeyholeLine,
  RiDashboard3Line,
  RiUploadCloud2Line,
  RiDatabase2Line,
  RiFireFill,
  RiStackLine
} from "@remixicon/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesProps {
  icon: React.ReactNode
  title: string
  description: string
}

const featureList: FeaturesProps[] = [
  {
    icon: <RiShieldKeyholeLine size={24} className="text-primary" />,
    title: "AI-Powered Builder",
    description:
      "Scubi.site is an AI-powered website builder made specifically for scuba diving businesses."
  },
  {
    icon: <RiDashboard3Line size={24} className="text-primary" />,
    title: "Instant Site Generation",
    description:
      "If you already have a website or Facebook page, Scubi scans your content and automatically generates a sleek new site — in minutes."
  },
  {
    icon: <RiUploadCloud2Line size={24} className="text-primary" />,
    title: "Simple Setup",
    description:
      "No site yet? No problem. Scubi guides you through a simple setup: just answer a few quick questions about your business."
  },
  {
    icon: <RiDatabase2Line size={24} className="text-primary" />,
    title: "No Tech Skills Needed",
    description:
      "No copy-pasting. No downtime. No technical knowledge required to create a professional dive shop website."
  },
  {
    icon: <RiFireFill size={24} className="text-primary" />,
    title: "Easy Booking & Contact",
    description:
      "Make it simple for customers to reach out or reserve a course with integrated booking and contact options."
  },
  {
    icon: <RiStackLine size={24} className="text-primary" />,
    title: "Professional Templates",
    description:
      "Already have images and a logo? Great. Just starting out? We've got free templates and placeholders."
  }
]

export const FeaturesSection = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-24 sm:py-32">
      <h2 className="mb-2 text-center text-lg text-primary tracking-wider">What Is Scubi?</h2>

      <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
        Built for Busy Dive Shop Owners
      </h2>

      <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-1/2">
        We built Scubi.site for busy dive shop owners, instructors, and new dive businesses who want
        a professional online presence — without the hassle or cost of hiring a web designer.
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full border-0 bg-background shadow-none">
              <CardHeader className="flex items-center justify-center gap-4 pb-2 align-middle">
                <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">{icon}</div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-center text-muted-foreground">{description}</CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}
