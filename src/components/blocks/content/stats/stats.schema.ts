import { z } from "zod"
import { BackgroundConfigSchema } from "../../shared/background"

export const StatItemSchema = z.object({
  label: z.string(),
  value: z.string()
})

export const StatsContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  stats: z.array(StatItemSchema),
  layout: z.enum(["grid", "horizontal"]).optional(),
  columns: z.enum(["2", "3", "4"]).optional(),
  background: BackgroundConfigSchema.optional(),
  textColor: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).optional()
})

export type StatItem = z.infer<typeof StatItemSchema>
export type StatsContent = z.infer<typeof StatsContentSchema>

export function isStatsContent(data: unknown): data is StatsContent {
  return StatsContentSchema.safeParse(data).success
}
