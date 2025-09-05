import { db } from "@/database/db"
import { eq, and, asc } from "drizzle-orm"
import { users, shopMembers } from "@/database/schema"

export const memberApi = {
  async getByShopId(shopId: string) {
    try {
      return await db
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
    } catch (error) {
      console.error("Failed to fetch shop members:", error)
      throw new Error("Failed to load shop members")
    }
  },

  async add(data: { userId: string; shopId: string; role?: string }) {
    try {
      const [member] = await db.insert(shopMembers).values(data).returning()
      return member
    } catch (error) {
      console.error("Failed to add shop member:", error)
      throw new Error("Failed to add shop member")
    }
  },

  async updateRole(userId: string, shopId: string, role: string) {
    try {
      const [member] = await db
        .update(shopMembers)
        .set({ role })
        .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
        .returning()
      return member || null
    } catch (error) {
      console.error("Failed to update member role:", error)
      throw new Error("Failed to update member role")
    }
  },

  async remove(userId: string, shopId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(shopMembers)
        .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
      return (result.rowCount ?? 0) > 0
    } catch (error) {
      console.error("Failed to remove shop member:", error)
      throw new Error("Failed to remove shop member")
    }
  },

  async getRole(userId: string, shopId: string): Promise<string | null> {
    try {
      const [member] = await db
        .select({ role: shopMembers.role })
        .from(shopMembers)
        .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
      return member?.role || null
    } catch (error) {
      console.error("Failed to get member role:", error)
      throw new Error("Failed to get member role")
    }
  },

  async isMember(userId: string, shopId: string): Promise<boolean> {
    try {
      const [member] = await db
        .select({ userId: shopMembers.userId })
        .from(shopMembers)
        .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
      return !!member
    } catch (error) {
      console.error("Failed to check membership:", error)
      return false
    }
  },

  async isAdmin(userId: string, shopId: string): Promise<boolean> {
    try {
      const [member] = await db
        .select({ role: shopMembers.role })
        .from(shopMembers)
        .where(and(eq(shopMembers.userId, userId), eq(shopMembers.shopId, shopId)))
      return member?.role === "admin"
    } catch (error) {
      console.error("Failed to check admin status:", error)
      return false
    }
  }
}
