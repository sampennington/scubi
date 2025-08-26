"use server"

import { api, type Block } from "@/lib/api"
import { revalidatePath } from "next/cache"
import type { BlockType } from "@/database/schema"
import { typeGuardMap } from "@/components/blocks/shared/schemas"

export async function getBlocks(
  pageId: string
): Promise<{ success: boolean; error?: string; blocks?: Block[] }> {
  try {
    console.log("Getting blocks ", pageId)
    const blocks = await api.blocks.getByPageId(pageId)

    return { success: true, blocks }
  } catch (error) {
    console.error("Error getting blocks:", error)
    return { success: false, error: "Failed to create block" }
  }
}

export async function createBlock(
  data: {
    pageId: string
    type: string
    content: Record<string, unknown>
    order?: number
  },
  revalidatePaths: string[] = []
): Promise<{ success: boolean; block?: Block; error?: string }> {
  try {
    const block = await api.blocks.create(data)

    // Revalidate all specified paths
    revalidatePaths.forEach((path) => revalidatePath(path))

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
  },
  revalidatePaths: string[] = []
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

    revalidatePaths.forEach((path) => revalidatePath(path))

    return { success: true, block }
  } catch (error) {
    console.error("Error updating block:", error)
    return { success: false, error: "Failed to update block" }
  }
}

export async function deleteBlock(id: string, revalidatePaths: string[] = []) {
  try {
    console.log("Deleting block", id)
    await api.blocks.delete(id)
    console.log("Deleted block", id)
    revalidatePaths.forEach((path) => revalidatePath(path))
    console.log("Revalidated paths", revalidatePaths)
    return { success: true }
  } catch (error) {
    console.error("Error deleting block:", error)
    return { success: false, error: "Failed to delete block" }
  }
}

export async function reorderBlocks(blockIds: string[], revalidatePaths: string[] = []) {
  try {
    await api.blocks.reorder(blockIds)

    revalidatePaths.forEach((path) => revalidatePath(path))

    return { success: true }
  } catch (error) {
    console.error("Error reordering blocks:", error)
    return { success: false, error: "Failed to reorder blocks" }
  }
}

export async function updateBlockOrder(id: string, order: number, revalidatePaths: string[] = []) {
  try {
    const block = await api.blocks.update(id, { order })

    revalidatePaths.forEach((path) => revalidatePath(path))

    return { success: true, block }
  } catch (error) {
    console.error("Error updating block order:", error)
    return { success: false, error: "Failed to update block order" }
  }
}

export async function getBlocksByPageId(pageId: string) {
  try {
    return await api.blocks.getByPageId(pageId)
  } catch (error) {
    console.error("Error getting blocks:", error)
    return []
  }
}
