import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { siteSettings } from "@/database/schema"

export type SiteSettings = typeof siteSettings.$inferSelect

export const siteSettingsApi = {
  async getByShopId(shopId: string): Promise<SiteSettings | null> {
    try {
      const [settings] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.shopId, shopId))

      return settings || null
    } catch (error) {
      console.error(error)
      return null
    }
  },

  async update(shopId: string, data: Partial<SiteSettings>) {
    const [settings] = await db
      .update(siteSettings)
      .set(data)
      .where(eq(siteSettings.shopId, shopId))
      .returning()

    return settings || null
  }
}
