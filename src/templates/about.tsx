import sampleImage from "@/assets/sample-dive-shop.jpg"
import Image from "next/image"

export const About = ({ body }: { body: string }) => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">About Our Dive Center</h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {body}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2000+</div>
              <div className="text-sm text-muted-foreground">
                Certified Divers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Dive Sites</div>
            </div>
          </div>
        </div>
        <div>
          <Image
            src={sampleImage}
            alt="Dive shop interior"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
)
