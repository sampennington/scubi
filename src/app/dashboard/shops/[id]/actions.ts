"use server"

import { api, type Page } from "@/lib/api"
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

export async function createPage(shopId: string, data: Partial<Page>) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    await api.pages.create({
      shopId,
      title: data.title || "Untitled Page",
      slug: data.slug || "/",
      metaTitle: data.metaTitle || "",
      metaDescription: data.metaDescription || ""
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating Page:", error)
    return { success: false, error: "Error creating Page" }
  }
}

export async function updatePage(id: string, data: Partial<Page>) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    await api.pages.update(id, data)

    return { success: true }
  } catch (error) {
    console.error("Error updating Page:", error)
    return { success: false, error: "Error updating Page" }
  }
}
