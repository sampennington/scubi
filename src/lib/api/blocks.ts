import { db } from "@/database/db"
import { eq, asc } from "drizzle-orm"
import { blocks } from "@/database/schema"

export type Block = typeof blocks.$inferSelect

export const blockApi = {
  async getByPageId(pageId: string): Promise<Block[]> {
    return db
      .select()
      .from(blocks)
      .where(eq(blocks.pageId, pageId))
      .orderBy(asc(blocks.order))
  },

  async create(data: {
    id: string
    pageId: string
    type: string
    content: Record<string, unknown>
    order?: number
  }): Promise<Block> {
    const [block] = await db.insert(blocks).values(data).returning()
    return block
  },

  async update(id: string, data: Partial<Block>): Promise<Block | null> {
    const [block] = await db
      .update(blocks)
      .set(data)
      .where(eq(blocks.id, id))
      .returning()
    return block || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(blocks).where(eq(blocks.id, id))
    return (result.rowCount ?? 0) > 0
  },

  async reorder(blockIds: string[]): Promise<void> {
    for (let i = 0; i < blockIds.length; i++) {
      await db
        .update(blocks)
        .set({ order: i })
        .where(eq(blocks.id, blockIds[i]))
    }
  }
}
