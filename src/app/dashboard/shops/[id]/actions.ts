"use server"

import { api } from "@/lib/api"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import type { SiteSettings } from "@/lib/api/types"
import type { Page } from "@/lib/api"
import { typeGuardMap } from "./components/BlockForm/schemas"
import type { BlockType } from "@/database/schema"

export async function getBlocksByPageId(pageId: string) {
  try {
    return await api.blocks.getByPageId(pageId)
  } catch (error) {
    console.error("Error getting blocks:", error)
    return []
  }
}

export async function createBlock(data: {
  pageId: string
  type: string
  content: Record<string, unknown>
  order?: number
}) {
  try {
    const block = await api.blocks.create(data)
    revalidatePath(`/dashboard/shops/${data.pageId}`)
    return { success: true, block }
  } catch (error) {
    console.error("Error creating block:", error)
    return { success: false, error: "Failed to create block" }
  }
}

export async function updateBlock(
  id: string,
  data: {
    type?: BlockType
    content?: Record<string, unknown>
    order?: number
  }
) {
  if (!data.type) {
    console.log("Block type is required", data)
    return { success: false, error: "Block type is required" }
  }

  try {
    const isTypeValid = typeGuardMap[data.type](data.content)

    if (!isTypeValid) {
      console.log("Invalid block type and/or content", data)
      return { success: false, error: "Invalid block type and/or content" }
    }

    const block = await api.blocks.update(id, data)

    revalidatePath(`/dashboard/shops/${id}`)
    return { success: true, block }
  } catch (error) {
    console.error("Error updating block:", error)
    return { success: false, error: "Failed to update block" }
  }
}

export async function deleteBlock(id: string) {
  try {
    await api.blocks.delete(id)
    revalidatePath(`/dashboard/shops/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting block:", error)
    return { success: false, error: "Failed to delete block" }
  }
}

export async function reorderBlocks(blockIds: string[]) {
  try {
    await api.blocks.reorder(blockIds)
    revalidatePath(`/dashboard/shops/${blockIds[0]}`)
    return { success: true }
  } catch (error) {
    console.error("Error reordering blocks:", error)
    return { success: false, error: "Failed to reorder blocks" }
  }
}

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
