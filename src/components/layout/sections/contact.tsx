"use client"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export const ContactSection = () => {
  return (
    <section id="contact" className="container mx-auto px-4 py-24 sm:py-32">
      <div className="grid place-items-center gap-8">
        <div className="text-center">
          <h2 className="mb-2 text-lg text-primary tracking-wider">
            Get Started in 60 Seconds
          </h2>

          <h2 className="mb-4 font-bold text-3xl md:text-4xl">
            Ready to Launch or Rebuild Your Dive Shop Website?
          </h2>

          <p className="mb-8 text-muted-foreground text-xl">
            Let Scubi handle your online presence — so you can focus on what you
            love: <strong>diving</strong>.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <Card className="bg-muted/60">
            <CardContent className="p-8 text-center">
              <h3 className="mb-4 text-xl font-bold">Have a website?</h3>
              <p className="mb-6 text-muted-foreground">
                Paste your current link — we'll rebuild it instantly.
              </p>
              <Button asChild size="lg" className="group/arrow rounded-full">
                <Link href="/auth/sign-up">
                  Paste Your Website URL → Build My New Site
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/60">
            <CardContent className="p-8 text-center">
              <h3 className="mb-4 text-xl font-bold">Starting from scratch?</h3>
              <p className="mb-6 text-muted-foreground">
                Answer a few simple questions, and Scubi will generate a
                complete site for you — ready to launch.
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="/auth/sign-up">Start from Scratch →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
