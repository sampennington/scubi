"use server"

import type { BlockType } from "@/database/schema"
import {
  createBlock as createBlockShared,
  updateBlock as updateBlockShared,
  deleteBlock as deleteBlockShared,
  reorderBlocks as reorderBlocksShared
} from "@/lib/actions/blocks"

export async function updateBlock(
  blockId: string,
  data: { type: BlockType; content: Record<string, unknown> }
) {
  return updateBlockShared(blockId, data, [`/preview/[shopId]`])
}

export async function deleteBlock(blockId: string) {
  return deleteBlockShared(blockId, [`/preview/[shopId]`])
}

export async function createBlock(data: {
  pageId: string
  type: string
  content: Record<string, unknown>
  order: number
}) {
  return createBlockShared(data, [`/preview/[shopId]`])
}

export async function reorderBlocks(blockIds: string[]) {
  return reorderBlocksShared(blockIds, [`/preview/[shopId]`])
}
