import { db } from "@/database/db"
import { eq, desc } from "drizzle-orm"
import { type users, shops, shopMembers } from "@/database/schema"
import { generateId } from "@/lib/utils"
import { notFound } from "next/navigation"

export type Shop = typeof shops.$inferSelect
export type ShopWithMembers = Shop & {
  members: (typeof shopMembers.$inferSelect & {
    user: typeof users.$inferSelect
  })[]
}

export const shopApi = {
  async getById(id: string): Promise<Shop | null> {
    try {
      const [shop] = await db.select().from(shops).where(eq(shops.id, id))
      if (!shop) {
        notFound()
      }
      return shop
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_NOT_FOUND') {
        throw error
      }
      console.error('Failed to fetch shop by ID:', error)
      throw new Error('Failed to load shop')
    }
  },

  async getBySlug(slug: string): Promise<Shop | null> {
    try {
      const [shop] = await db.select().from(shops).where(eq(shops.slug, slug))
      if (!shop) {
        notFound()
      }
      return shop
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_NOT_FOUND') {
        throw error
      }
      console.error('Failed to fetch shop by slug:', error)
      throw new Error('Failed to load shop')
    }
  },

  async getByDomain(domain: string): Promise<Shop | null> {
    try {
      const [shop] = await db.select().from(shops).where(eq(shops.customDomain, domain))
      return shop || null
    } catch (error) {
      console.error('Failed to fetch shop by domain:', error)
      throw new Error('Failed to load shop')
    }
  },

  async getByUserId(userId: string): Promise<Shop[]> {
    try {
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
        .where(eq(shopMembers.userId, userId))
        .orderBy(desc(shops.createdAt))

      return results
    } catch (error) {
      console.error('Failed to fetch shops by user ID:', error)
      throw new Error('Failed to load shops')
    }
  },

  async create(data: {
    name: string
    slug: string
    createdBy: string
    customDomain?: string
    templateId?: string
  }): Promise<Shop> {
    try {
      const [shop] = await db
        .insert(shops)
        .values({
          id: generateId(),
          ...data
        })
        .returning()

      return shop
    } catch (error) {
      console.error('Failed to create shop:', error)
      throw new Error('Failed to create shop')
    }
  },

  async update(id: string, data: Partial<Shop>): Promise<Shop | null> {
    try {
      const [shop] = await db.update(shops).set(data).where(eq(shops.id, id)).returning()
      return shop || null
    } catch (error) {
      console.error('Failed to update shop:', error)
      throw new Error('Failed to update shop')
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.delete(shops).where(eq(shops.id, id))
      return (result.rowCount ?? 0) > 0
    } catch (error) {
      console.error('Failed to delete shop:', error)
      throw new Error('Failed to delete shop')
    }
  }
}
