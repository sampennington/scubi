"use server"

import { api } from "@/lib/api"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import type { SiteSettings } from "@/lib/api/types"

export async function updateSiteSettings(
  shopId: string,
  data: Partial<SiteSettings>
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    await api.siteSettings.update(shopId, data)

    return { success: true }
  } catch (error) {
    console.error("Error updating site settings:", error)
    return { success: false, error: "Error updating site settings" }
  }
}
