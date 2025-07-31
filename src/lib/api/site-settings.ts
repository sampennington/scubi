import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { siteSettings } from "@/database/schema"

export const siteSettingsApi = {
  async getByShopId(shopId: string) {
    const [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.shopId, shopId))
    return settings || null
  },

  async update(
    shopId: string,
    data: Partial<typeof siteSettings.$inferSelect>
  ) {
    const [settings] = await db
      .update(siteSettings)
      .set(data)
      .where(eq(siteSettings.shopId, shopId))
      .returning()
    return settings || null
  }
}
