import { z } from "zod"
import { BlockType } from "@/database/schema"
import { BlockSchemas } from "@/components/blocks/schemas"
// Avoid runtime dependency conflicts: implement a minimal Zod-to-JSON helper
function zodShapeToJson(schema: z.ZodTypeAny): unknown {
  // We don't need a perfect conversion; the LLM benefits from examples/fields.
  // Emit a shallow example by parsing an empty object and reporting issues as keys.
  const shape: Record<string, string> = {}
  const check = schema.safeParse({})
  if (!check.success) {
    for (const issue of check.error.issues) {
      const path = issue.path.join(".") || "root"
      shape[path] = issue.message
    }
  }
  return { exampleHints: shape }
}
import { LlmBlockCandidateSchema, LlmSectionSchema } from "./models"

export async function llmExtractBlocks(input: {
  siteName?: string
  url: string
  text: string
  html?: string
}) {
  const sys = `You convert a rendered web page into (1) a structured list of sections and (2) block candidates to recreate the page using a block-based builder.
Return JSON: { "sections": [...], "blocks": [...] }.
Sections: each item is { type, title?, contentText?, contentHtml?, images[], confidence, rationale? }.
Blocks: ordered top-to-bottom; each item is { type, order, content, sourceSectionType?, confidence, rationale }.
The 'order' must be a stable integer starting at 0 and increasing by 1 in visual stack order.
Ensure 'content' strictly matches the JSON Schema for its block type.
Use only these block types when suitable: ${Object.values(BlockType).join(", ")}.`

  // Provide strict JSON Schemas for each block content to maximize correctness
  const schemaSpec = Object.fromEntries(
    Object.entries(BlockSchemas).map(([key, schema]) => [key, zodShapeToJson(schema as z.ZodTypeAny)])
  )

  const user = [
    `URL: ${input.url}`,
    input.siteName ? `Site: ${input.siteName}` : "",
    `TEXT:\n${input.text.slice(0, 18000)}`
  ].join("\n")

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return []

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sys },
        { role: "system", content: `Block content JSON Schemas by type (strict):\n${JSON.stringify(schemaSpec)}` },
        { role: "user", content: user }
      ]
    })
  })
  const data = await resp.json().catch(() => ({}))
  const raw = data?.choices?.[0]?.message?.content || "{}"
  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(raw)
  } catch {
    parsedJson = {}
  }
  const parsedBlocks = z.array(LlmBlockCandidateSchema).safeParse(
    (parsedJson as { blocks?: unknown[];[k: string]: unknown }).blocks ?? []
  )
  const parsedSections = z.array(LlmSectionSchema).safeParse(
    (parsedJson as { sections?: unknown[];[k: string]: unknown }).sections ?? []
  )

  const blocks = (parsedBlocks.success ? parsedBlocks.data : []).filter((c) => {
    const schema = (BlockSchemas as Record<string, z.ZodTypeAny>)[c.type as string]
    if (!schema) return false
    return schema.safeParse(c.content).success
  })
  const sections = parsedSections.success ? parsedSections.data : []
  return { blocks, sections }
}


