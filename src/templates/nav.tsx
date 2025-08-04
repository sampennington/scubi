import { Facebook, Instagram, MessageCircle } from "lucide-react"
import type { SiteSettings } from "@/lib/api/types"
import type { NavigationItem } from "@/lib/api"
import Image from "next/image"

export const Nav = ({
  pages,
  siteSettings
}: {
  pages: NavigationItem[]
  siteSettings: SiteSettings
}) => {
  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center border-border/40 border-b bg-background/95 backdrop-blur-sm">
      <div className="container relative mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {siteSettings.logoUrl ? (
              <Image
                src={siteSettings.logoUrl}
                alt={siteSettings.name}
                className=" left-20 max-h-16 w-auto object-contain"
                width={120}
                height={40}
              />
            ) : (
              <div className="font-bold text-2xl text-primary">
                {siteSettings.name}
              </div>
            )}
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {pages.map((page) => (
              <NavItem key={page.id} item={page} />
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
}

const NavItem = ({ item }: { item: NavigationItem }) => {
  return (
    <div key={item.id} className="group relative">
      <a
        href={item.slug}
        className="font-medium text-sm transition-colors hover:text-primary"
      >
        {item.title}
      </a>

      {item.children && item.children.length > 0 && (
        <div className="absolute top-full left-0 z-50 hidden min-w-[200px] rounded-md border border-gray-200 bg-white py-2 shadow-lg group-hover:block">
          {item.children.map((child) => (
            <a
              key={child.id}
              href={child.slug}
              className="block w-full px-4 py-2 text-left text-gray-700 text-sm transition-colors hover:bg-gray-100"
            >
              {child.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
