import { db } from "@/database/db"
import { eq, and, asc } from "drizzle-orm"
import { users, shopMembers } from "@/database/schema"

export const memberApi = {
  async getByShopId(shopId: string) {
    return db
      .select({
        userId: shopMembers.userId,
        shopId: shopMembers.shopId,
        role: shopMembers.role,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          emailVerified: users.emailVerified,
          image: users.image,
          avatar: users.avatar,
          avatarUrl: users.avatarUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          stripeCustomerId: users.stripeCustomerId
        }
      })
      .from(shopMembers)
      .innerJoin(users, eq(shopMembers.userId, users.id))
      .where(eq(shopMembers.shopId, shopId))
      .orderBy(asc(shopMembers.role))
  },

  async add(data: { userId: string; shopId: string; role?: string }) {
    const [member] = await db.insert(shopMembers).values(data).returning()
    return member
  },

  async updateRole(userId: string, shopId: string, role: string) {
    const [member] = await db
      .update(shopMembers)
      .set({ role })
      .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
      .returning()
    return member || null
  },

  async remove(userId: string, shopId: string): Promise<boolean> {
    const result = await db
      .delete(shopMembers)
      .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
    return (result.rowCount ?? 0) > 0
  },

  async getRole(userId: string, shopId: string): Promise<string | null> {
    const [member] = await db
      .select({ role: shopMembers.role })
      .from(shopMembers)
      .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
    return member?.role || null
  },

  async isMember(userId: string, shopId: string): Promise<boolean> {
    const [member] = await db
      .select({ userId: shopMembers.userId })
      .from(shopMembers)
      .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
    return !!member
  },

  async isAdmin(userId: string, shopId: string): Promise<boolean> {
    const [member] = await db
      .select({ role: shopMembers.role })
      .from(shopMembers)
      .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
    return member?.role === "admin"
  }
}
