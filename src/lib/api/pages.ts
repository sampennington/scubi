import { db } from "@/database/db"
import { eq, and, asc } from "drizzle-orm"
import { pages } from "@/database/schema"

export type Page = typeof pages.$inferSelect

export const pageApi = {
  async getById(id: string): Promise<Page | null> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id))
    return page || null
  },

  async getBySlug(shopId: string, slug: string): Promise<Page | null> {
    const [page] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.shopId, shopId), eq(pages.slug, slug)))
    return page || null
  },

  async getByShopId(shopId: string): Promise<Page[]> {
    return db
      .select()
      .from(pages)
      .where(eq(pages.shopId, shopId))
      .orderBy(asc(pages.slug))
  },

  async create(data: {
    id: string
    shopId: string
    title: string
    slug: string
    metaTitle?: string
    metaDescription?: string
  }): Promise<Page> {
    const [page] = await db.insert(pages).values(data).returning()
    return page
  },

  async update(id: string, data: Partial<Page>): Promise<Page | null> {
    const [page] = await db
      .update(pages)
      .set(data)
      .where(eq(pages.id, id))
      .returning()
    return page || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id))
    return (result.rowCount ?? 0) > 0
  }
}
