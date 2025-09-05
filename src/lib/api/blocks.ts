import { db } from "@/database/db"
import { eq, asc } from "drizzle-orm"
import { blocks } from "@/database/schema"
import { generateId } from "@/lib/utils"

export type Block = typeof blocks.$inferSelect
export const blockApi = {
  async getByPageId(pageId: string): Promise<Block[]> {
    try {
      return await db
        .select()
        .from(blocks)
        .where(eq(blocks.pageId, pageId))
        .orderBy(asc(blocks.order))
    } catch (error) {
      console.error("Failed to fetch blocks by page ID:", error)
      throw new Error("Failed to load blocks")
    }
  },

  async getById(id: string): Promise<Block | null> {
    try {
      const [block] = await db.select().from(blocks).where(eq(blocks.id, id))
      return block || null
    } catch (error) {
      console.error("Failed to fetch block by ID:", error)
      throw new Error("Failed to load block")
    }
  },

  async create(data: {
    pageId: string
    type: string
    content: Record<string, unknown>
    order: number
  }): Promise<Block> {
    try {
      const [block] = await db
        .insert(blocks)
        .values({
          id: generateId(),
          ...data
        })
        .returning()
      return block
    } catch (error) {
      console.error("Failed to create block:", error)
      throw new Error("Failed to create block")
    }
  },

  async update(id: string, data: Partial<Block>): Promise<Block | null> {
    try {
      const [block] = await db.update(blocks).set(data).where(eq(blocks.id, id)).returning()
      return block || null
    } catch (error) {
      console.error("Failed to update block:", error)
      throw new Error("Failed to update block")
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.delete(blocks).where(eq(blocks.id, id))
      return (result.rowCount ?? 0) > 0
    } catch (error) {
      console.error("Failed to delete block:", error)
      throw new Error("Failed to delete block")
    }
  },

  async reorder(blockIds: string[]): Promise<void> {
    try {
      for (let i = 0; i < blockIds.length; i++) {
        await db.update(blocks).set({ order: i }).where(eq(blocks.id, blockIds[i]))
      }
    } catch (error) {
      console.error("Failed to reorder blocks:", error)
      throw new Error("Failed to reorder blocks")
    }
  }
}
