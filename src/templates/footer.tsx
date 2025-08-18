import { Facebook, Instagram, MessageCircle } from "lucide-react"
import { useSite } from "@/app/preview/components/site-context"

export const Footer = () => {
  const { siteSettings } = useSite()
  return (
    <footer className="border-border/20 border-t bg-primary/5 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold text-lg">{siteSettings.name}</h3>
            <p className="text-muted-foreground text-sm">
              Your gateway to underwater adventures and professional dive training.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <div className="cursor-pointer text-muted-foreground hover:text-primary">Courses</div>
              <div className="cursor-pointer text-muted-foreground hover:text-primary">
                Fun Dives
              </div>
              <div className="cursor-pointer text-muted-foreground hover:text-primary">
                Equipment
              </div>
              <div className="cursor-pointer text-muted-foreground hover:text-primary">About</div>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <div className="space-y-2 text-muted-foreground text-sm">
              <div>{siteSettings.phoneNumber}</div>
              <div>{siteSettings.email}</div>
              <div>{siteSettings.address}</div>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Follow Us</h4>
            <div className="flex gap-4">
              {siteSettings.facebookUrl && (
                <a
                  href={siteSettings.facebookUrl}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {siteSettings.instagramUrl && (
                <a
                  href={siteSettings.instagramUrl}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              <a
                href={`https://wa.me/${siteSettings.whatsappUrl}`}
                className="text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-border/20 border-t pt-8 text-center text-muted-foreground text-sm">
          <p>© 2025 {siteSettings.name}. All rights reserved. Powered by DiveSiteBuilder.</p>
        </div>
      </div>
    </footer>
  )
}
