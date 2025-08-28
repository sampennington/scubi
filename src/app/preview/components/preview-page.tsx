import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { TemplateProvider } from "./site-context"
import { PreviewControls } from "@/app/preview/components/preview-controls"
import { Preview } from "./preview"

interface SiteWrapperProps {
  shopId: string
  slug?: string[]
}

export async function PreviewPage({ shopId, slug }: SiteWrapperProps) {
  const currentPath = slug && slug.length > 0 ? `/${slug.join("/")}` : "/"
  const isHome = currentPath === "/"

  const [currentPage, pages, siteSettings, session, member] = await Promise.all([
    api.pages.getBySlug(shopId, isHome ? "/" : currentPath),
    api.pages.getNavigationTree(shopId),
    api.siteSettings.getByShopId(shopId),
    auth.api.getSession({ headers: await headers() }),
    api.members.getByShopId(shopId)
  ])

  if (!currentPage) {
    return notFound()
  }

  if (!siteSettings) {
    return <div>No site settings found, please create one</div>
  }

  const isShopOwner = member.some((m) => m.userId === session?.user?.id)

  return (
    <div className="relative">
      <TemplateProvider
        shopId={shopId}
        siteSettings={siteSettings}
        pages={pages}
        currentPage={currentPage}
        currentPath={currentPath}
        isShopOwner={isShopOwner}
      >
        <PreviewControls shopId={shopId} />
        <Preview />
      </TemplateProvider>
    </div>
  )
}
