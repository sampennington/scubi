"use server"

import { api } from "@/lib/api"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import type { SiteSettings } from "@/lib/api/types"
import type { Page } from "@/lib/api"
import type { BlockType } from "@/database/schema"
import {
  createBlock as createBlockShared,
  updateBlock as updateBlockShared,
  deleteBlock as deleteBlockShared,
  reorderBlocks as reorderBlocksShared,
  getBlocksByPageId as getBlocksByPageIdShared
} from "@/lib/actions/blocks"

export const getBlocksByPageId = getBlocksByPageIdShared

export async function createBlock(data: {
  pageId: string
  type: string
  content: Record<string, unknown>
  order: number
}) {
  return createBlockShared(data, [`/dashboard/shops/${data.pageId}`])
}

export async function updateBlock(
  id: string,
  data: {
    type?: BlockType
    content?: Record<string, unknown>
    order?: number
  }
) {
  return updateBlockShared(id, data, [`/dashboard/shops/${id}`])
}

export async function deleteBlock(id: string) {
  return deleteBlockShared(id, [`/dashboard/shops/${id}`])
}

export async function reorderBlocks(blockIds: string[]) {
  return reorderBlocksShared(blockIds, [`/dashboard/shops/${blockIds[0]}`])
}

export async function updateSiteSettings(shopId: string, data: Partial<SiteSettings>) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await api.siteSettings.update(shopId, data)
    return { success: true }
  } catch (error) {
    console.error("Error updating site settings:", error)
    return { success: false, error: "Could not update site settings. Please try again." }
  }
}

export async function createPage(shopId: string, data: Partial<Page>) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await api.pages.create({
      shopId,
      title: data.title || "Untitled Page",
      slug: data.slug || "/",
      metaTitle: data.metaTitle || "",
      metaDescription: data.metaDescription || ""
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating page:", error)
    return { success: false, error: "Could not create page. Please try again." }
  }
}

export async function updatePage(id: string, data: Partial<Page>) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await api.pages.update(id, data)
    return { success: true }
  } catch (error) {
    console.error("Error updating page:", error)
    return { success: false, error: "Could not update page. Please try again." }
  }
}
