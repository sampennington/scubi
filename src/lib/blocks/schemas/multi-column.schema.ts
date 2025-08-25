import { z } from "zod"

export const ColumnContentSchema = z.object({
  icon: z.string().optional(),
  heading: z.string().optional(),
  body: z.string()
})

export const MultiColumnContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(ColumnContentSchema),
  columnsPerRow: z.enum(["1", "2", "3", "4"]).optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  showIcons: z.boolean().optional()
})

export type ColumnContent = z.infer<typeof ColumnContentSchema>
export type MultiColumnContent = z.infer<typeof MultiColumnContentSchema>

export function isMultiColumnContent(data: unknown): data is MultiColumnContent {
  return MultiColumnContentSchema.safeParse(data).success
}