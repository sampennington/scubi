import { z } from "zod"

export const TextContentSchema = z.object({
  text: z.string(),
  alignment: z.enum(["left", "center", "right"]).optional()
})

export type TextContent = z.infer<typeof TextContentSchema>

export function isTextContent(data: unknown): data is TextContent {
  return TextContentSchema.safeParse(data).success
}