import { db } from "@/database/db"
import { eq, desc } from "drizzle-orm"
import { subscriptions } from "@/database/schema"

export const subscriptionApi = {
  async getByUserId(userId: string) {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.referenceId, userId))
      .orderBy(desc(subscriptions.id))
      .limit(1)
    return subscription || null
  },

  async create(data: {
    id: string
    plan: string
    referenceId: string
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    status?: string
    seats?: number
  }) {
    const [subscription] = await db
      .insert(subscriptions)
      .values(data)
      .returning()
    return subscription
  },

  async update(id: string, data: Partial<typeof subscriptions.$inferSelect>) {
    const [subscription] = await db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, id))
      .returning()
    return subscription || null
  }
}
