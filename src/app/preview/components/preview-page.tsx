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

  const currentPage = await api.pages.getBySlug(shopId, isHome ? "/" : currentPath)
  const pages = await api.pages.getNavigationTree(shopId)

  if (!currentPage) {
    return notFound()
  }

  const siteSettings = await api.siteSettings.getByShopId(shopId)

  if (!siteSettings) {
    return <div>No site settings found, please create one</div>
  }

  const session = await auth.api.getSession({ headers: await headers() })
  const isShopOwner = session?.user?.id === siteSettings.shopId

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
