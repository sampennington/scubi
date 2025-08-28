"use server"

import { api } from "@/lib/api"
import { revalidatePath } from "next/cache"
import type { SiteSettings } from "@/lib/api/types"

export async function updateSiteSettings(
  shopId: string,
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    await api.siteSettings.update(shopId, settings)

    // Revalidate the preview pages
    revalidatePath(`/preview/${shopId}`)
    revalidatePath(`/preview/${shopId}/[...slug]`)

    return { success: true }
  } catch (error) {
    console.error("Error updating site settings:", error)
    return { success: false, error: "Failed to update site settings" }
  }
}

export async function getSiteSettings(
  shopId: string
): Promise<{ success: boolean; settings?: SiteSettings | null; error?: string }> {
  try {
    const siteSettings = await api.siteSettings.getByShopId(shopId)
    return { success: true, settings: siteSettings }
  } catch (error) {
    console.error("Error getting site settings:", error)
    return { success: false, error: "Failed to get site settings" }
  }
}
