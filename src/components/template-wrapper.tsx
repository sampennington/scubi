import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import DiveShopSite from "@/templates/default"
import { TemplateProvider } from "./template-context"

interface TemplateWrapperProps {
  shopId: string
  slug?: string[]
}

export async function TemplateWrapper({ shopId, slug }: TemplateWrapperProps) {
  // Handle both undefined slug (root path) and empty array
  const currentPath = slug && slug.length > 0 ? `/${slug.join("/")}` : "/"
  const isHome = currentPath === "/"

  const currentPage = await api.pages.getBySlug(
    shopId,
    isHome ? "/" : currentPath
  )
  const pages = await api.pages.getNavigationTree(shopId)

  if (!currentPage) {
    return notFound()
  }

  const blocks = await api.blocks.getByPageId(currentPage.id)
  const siteSettings = await api.siteSettings.getByShopId(shopId)

  if (!siteSettings) {
    return <div>No site settings found, please create one</div>
  }

  // Get session to determine shop ownership
  const session = await auth.api.getSession({ headers: await headers() })
  const isShopOwner = session?.user?.id === siteSettings.shopId

  // Check if edit mode is enabled via query parameter
  const searchParams = new URLSearchParams()
  const isEditMode = searchParams.get("edit") === "true"

  const templateContextValue = {
    shopId,
    isShopOwner,
    isEditMode,
    currentPage,
    pages,
    blocks,
    siteSettings,
    currentPath,
    isHome
  }

  return (
    <TemplateProvider value={templateContextValue}>
      <DiveShopSite
        currentPage={currentPage}
        pages={pages}
        blocks={blocks}
        siteSettings={siteSettings}
      />
    </TemplateProvider>
  )
}
