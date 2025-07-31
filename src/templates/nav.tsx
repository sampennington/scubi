import { Facebook, Instagram, MessageCircle } from "lucide-react"
import type { SiteSettings } from "@/lib/api/site-settings"

export const Nav = ({
  setCurrentPage,
  currentPage,
  name,
  siteSettings
}: {
  setCurrentPage: (page: string) => void
  currentPage: string
  name: string
  siteSettings: SiteSettings
}) => (
  <nav className="sticky top-0 z-50 border-border/40 border-b bg-background/95 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl text-primary">{name}</div>
        <div className="hidden items-center gap-6 md:flex">
          {["home", "about", "courses", "fun-dives", "contact"].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`font-medium text-sm transition-colors hover:text-primary ${
                currentPage === page ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
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
          {siteSettings.whatsappUrl && (
            <a
              href={`https://wa.me/${siteSettings.whatsappUrl}`}
              className="text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  </nav>
)
