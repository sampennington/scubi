import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

enum ServiceStatus {
  SOON = 1,
  READY = 0
}
interface ServiceProps {
  title: string
  pro: ServiceStatus
  description: string
}
const serviceList: ServiceProps[] = [
  {
    title: "PADI, SSI, and RAID dive shops",
    description:
      "Established dive centers looking to modernize their online presence and attract more customers.",
    pro: 0
  },
  {
    title: "New or independent instructors",
    description:
      "Individual instructors starting their own dive business who need a professional website quickly.",
    pro: 0
  },
  {
    title: "Liveaboards and dive resorts",
    description:
      "Dive resorts and liveaboard operators needing to showcase their unique experiences and booking capabilities.",
    pro: 0
  },
  {
    title: "Anyone starting or improving their scuba business online",
    description:
      "New dive businesses or those looking to upgrade from basic social media presence.",
    pro: 0
  }
]

export const ServicesSection = () => {
  return (
    <section id="services" className="container mx-auto px-4 py-24 sm:py-32">
      <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
        Who Scubi Is For
      </h2>

      <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
        Perfect for Every Type of Dive Business
      </h2>
      <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-1/2">
        Whether you're an established dive shop or just starting out, Scubi
        helps you create a professional online presence that brings in more
        divers.
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />

      <div className="mx-auto grid w-full gap-4 sm:grid-cols-2 lg:w-[60%] lg:grid-cols-2">
        {serviceList.map(({ title, description }) => (
          <Card key={title} className="relative h-full bg-muted/60">
            <CardHeader>
              <CardTitle className="font-bold text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
