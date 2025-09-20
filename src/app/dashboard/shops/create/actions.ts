"use server"

import { api } from "@/lib/api"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import type { SiteSettingsInsert } from "@/lib/api/types"

export async function createShop(
  name: string,
  domain?: string,
  siteSettings?: Omit<SiteSettingsInsert, "shopId">
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    const shop = await api.shops.create({
      name,
      createdBy: session.user.id,
      customDomain: domain
    })

    await api.members.add({ shopId: shop.id, userId: session.user.id })

    if (siteSettings) {
      try {
        await api.siteSettings.update(shop.id, siteSettings)
      } catch (settingsError) {
        console.warn("Failed to create site settings:", settingsError)
        // Don't fail shop creation if site settings fail
      }
    }

    await api.pages.createExamplePages(shop.id)

    revalidatePath("/dashboard/shops")
    return { success: true, shop }
  } catch (error) {
    console.error("Error creating shop:", error)
    return { success: false, error: "Failed to create shop" }
  }
}
