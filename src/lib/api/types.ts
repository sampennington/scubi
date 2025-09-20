import type { blocks, siteSettings } from "@/database/schema"

export type SiteSettings = typeof siteSettings.$inferSelect
export type SiteSettingsInsert = typeof siteSettings.$inferInsert
export type Block = typeof blocks.$inferSelect
export type BlockInsert = typeof blocks.$inferInsert
