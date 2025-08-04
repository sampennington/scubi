import type { blocks, siteSettings } from "@/database/schema"

export type SiteSettings = typeof siteSettings.$inferSelect
export type Block = typeof blocks.$inferSelect
export type BlockInsert = typeof blocks.$inferInsert
