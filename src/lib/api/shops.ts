import { db } from "@/database/db"
import { eq, desc } from "drizzle-orm"
import { users, shops, shopMembers } from "@/database/schema"
import { generateId } from "@/lib/utils"

export type Shop = typeof shops.$inferSelect
export type ShopWithMembers = Shop & {
  members: (typeof shopMembers.$inferSelect & {
    user: typeof users.$inferSelect
  })[]
}

export const shopApi = {
  async getById(id: string): Promise<Shop | null> {
    const [shop] = await db.select().from(shops).where(eq(shops.id, id))
    return shop || null
  },

  async getBySlug(slug: string): Promise<Shop | null> {
    const [shop] = await db.select().from(shops).where(eq(shops.slug, slug))
    return shop || null
  },

  async getByDomain(domain: string): Promise<Shop | null> {
    const [shop] = await db
      .select()
      .from(shops)
      .where(eq(shops.customDomain, domain))
    return shop || null
  },

  async getByUserId(userId: string): Promise<Shop[]> {
    const results = await db
      .select({
        id: shops.id,
        name: shops.name,
        slug: shops.slug,
        customDomain: shops.customDomain,
        templateId: shops.templateId,
        createdBy: shops.createdBy,
        createdAt: shops.createdAt
      })
      .from(shops)
      .innerJoin(shopMembers, eq(shops.id, shopMembers.shopId))
    // .where(eq(shopMembers.userId, userId))
    // .orderBy(desc(shops.createdAt))
    return results
  },

  async create(data: {
    name: string
    slug: string
    createdBy: string
    customDomain?: string
    templateId?: string
  }): Promise<Shop> {
    const [shop] = await db
      .insert(shops)
      .values({
        id: generateId(),
        ...data
      })
      .returning()
    return shop
  },

  async update(id: string, data: Partial<Shop>): Promise<Shop | null> {
    const [shop] = await db
      .update(shops)
      .set(data)
      .where(eq(shops.id, id))
      .returning()
    return shop || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(shops).where(eq(shops.id, id))
    return (result.rowCount ?? 0) > 0
  }
}
