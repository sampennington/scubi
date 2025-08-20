import { z } from "zod"
import { BlockType } from "@/database/schema"
import { BlockSchemas } from "@/components/blocks/schemas"
import { LlmBlockCandidateSchema } from "./models"

export async function llmExtractBlocks(input: {
  siteName?: string
  url: string
  text: string
  html?: string
}) {
  const sys = `You convert page content into website blocks compatible with a block-based builder.
Output a JSON object with { "blocks": [...] } where each item has: type, content, optional sourceSectionType, confidence (0-1), rationale.
Use only these block types when suitable: ${Object.values(BlockType).join(", ")}. Ensure content matches the schema for that type.`

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
  const parsed = z.array(LlmBlockCandidateSchema).safeParse(
    (parsedJson as { blocks?: unknown[];[k: string]: unknown }).blocks ?? parsedJson
  )
  if (!parsed.success) return []

  return parsed.data.filter((c) => {
    const schema = (BlockSchemas as Record<string, z.ZodTypeAny>)[c.type as string]
    if (!schema) return false
    return schema.safeParse(c.content).success
  })
}


