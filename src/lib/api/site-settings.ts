import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { siteSettings } from "@/database/schema"
import type { SiteSettings } from "./types"

export const siteSettingsApi = {
  async getByShopId(shopId: string): Promise<SiteSettings | null> {
    try {
      const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.shopId, shopId))
      return settings || null
    } catch (error) {
      console.error('Failed to fetch site settings by shop ID:', error)
      throw new Error('Failed to load site settings')
    }
  },

  async update(shopId: string, data: Partial<SiteSettings>) {
    try {
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
    } catch (error) {
      console.error('Failed to update site settings:', error)
      throw new Error('Failed to update site settings')
    }
  }
}
