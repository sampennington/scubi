import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { siteSettings } from "@/database/schema"
import type { SiteSettings } from "./types"

export const siteSettingsApi = {
  async getByShopId(shopId: string): Promise<SiteSettings | null> {
    try {
      const [settings] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.shopId, shopId))

      console.log({ settings })

      return settings || null
    } catch (error) {
      console.error(error)
      return null
    }
  },

  async update(shopId: string, data: Partial<SiteSettings>) {
    // Filter out undefined values and ensure required fields
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    )

    const [result] = await db
      .insert(siteSettings)
      .values({
        shopId,
        name: cleanData.name || "Untitled Shop", // Provide default for required field
        ...cleanData
      })
      .onConflictDoUpdate({
        target: siteSettings.shopId,
        set: cleanData
      })
      .returning()

    return result || null
  }
}
