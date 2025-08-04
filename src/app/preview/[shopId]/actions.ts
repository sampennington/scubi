"use server"

import { api } from "@/lib/api"
import { revalidatePath } from "next/cache"

export async function updateBlock(
  blockId: string,
  data: { type: string; content: Record<string, unknown> }
) {
  try {
    const updatedBlock = await api.blocks.update(blockId, {
      type: data.type,
      content: data.content
    })
    revalidatePath(`/preview/[shopId]`)
    return { success: true, data: updatedBlock }
  } catch (error) {
    console.error("Failed to update block:", error)
    return { success: false, error: "Failed to update block" }
  }
}

export async function deleteBlock(blockId: string) {
  try {
    const success = await api.blocks.delete(blockId)
    revalidatePath(`/preview/[shopId]`)
    return { success }
  } catch (error) {
    console.error("Failed to delete block:", error)
    return { success: false, error: "Failed to delete block" }
  }
}

export async function createBlock(data: {
  pageId: string
  type: string
  content: Record<string, unknown>
  order: number
}) {
  try {
    const newBlock = await api.blocks.create(data)
    revalidatePath(`/preview/[shopId]`)
    return { success: true, data: newBlock }
  } catch (error) {
    console.error("Failed to create block:", error)
    return { success: false, error: "Failed to create block" }
  }
}

export async function reorderBlocks(blockIds: string[]) {
  try {
    await api.blocks.reorder(blockIds)
    revalidatePath(`/preview/[shopId]`)
    return { success: true }
  } catch (error) {
    console.error("Failed to reorder blocks:", error)
    return { success: false, error: "Failed to reorder blocks" }
  }
}
