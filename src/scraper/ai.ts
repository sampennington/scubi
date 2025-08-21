import { z } from "zod"
import { BlockType, BlockTypeDescriptions } from "@/database/schema"
import { BlockSchemas } from "@/components/blocks/schemas"
import { debug, error, warn } from "@/scraper/utils/logger"
import { openaiChatJson } from "@/scraper/utils/openai"

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

// Convert a single section to a block using LLM
async function convertSectionToBlock(section: any, blockType: string, html: string, order: number) {
  const blockSchema = BlockSchemas[blockType as keyof typeof BlockSchemas]
  if (!blockSchema) {
    warn(`No schema found for block type: ${blockType}`)
    return null
  }

  const schemaInfo = zodShapeToJson(blockSchema)

  const systemPrompt = `You are converting a website section into a ${blockType} block. 
  
Block Description: ${BlockTypeDescriptions[blockType as keyof typeof BlockTypeDescriptions]}

You must return valid JSON that matches the schema for this block type. The content should be structured according to the block's requirements.

Return only the JSON content object, not wrapped in any other structure.`

  const userPrompt = `Section Information:
- Title: ${section.title || "No title"}
- Content: ${section.contentText || "No content"}
- Images: ${JSON.stringify(section.images || [])}
- HTML: ${section.html || html}

Block Type: ${blockType}
Order: ${order}

Schema Hints: ${JSON.stringify(schemaInfo)}

Please convert this section into a ${blockType} block content object.`

  try {
    const resp = await openaiChatJson({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })

    const data = (await resp.json()) as any
    const rawContent = data?.choices?.[0]?.message?.content || "{}"

    // Parse the content and validate against schema
    const parsedContent = JSON.parse(rawContent)
    const validation = blockSchema.safeParse(parsedContent)

    if (!validation.success) {
      warn(`Block content validation failed for ${blockType}:`, validation.error.message)
      return null
    }

    return {
      type: blockType,
      order,
      content: validation.data,
      sourceSectionType: section.type,
      confidence: section.confidence || 0.8,
      rationale: `Converted from ${section.type} section: ${section.title}`
    }
  } catch (e) {
    error(`Failed to convert section to ${blockType} block:`, e)
    return null
  }
}

export async function llmExtractBlocks(input: {
  siteName?: string
  url: string
  text: string
  html?: string
  screenshot?: string
}) {
  const sectionSystemPrompt = `
  You are a web scraping assistant. You will be given the HTML of a web page and you should analyze the page to break it into sections 
  that are visually distinct and have a clear purpose.
  You will output this data as valid JSON with the following schema:
  {
    "sections": [
      {
        "type": "section",
        "title": "string",
        "contentText": "string",
        "images": [{
          "url": "string",
          "alt": "string",
          "width": "number",
          "height": "number",
          "description": "string", // To be used to understand the image, how is it used on the page? What is it showing?
        }],
        "confidence": "number",
        "rationale": "string",
        "html": "string" // The raw HTML of the section.
        }
    ],
  }
  
  Where type is one of the following:
  ${Object.entries(BlockTypeDescriptions)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")}
  You should use the confidence score to determine the likelihood of the section being of a particular type. If you are not confident at all, it should be 0. If you are very confident, it should be 1.
  `

  const sectionsResult = await openaiChatJson({
    messages: [
      { role: "system", content: sectionSystemPrompt },
      { role: "user", content: `HTML: ${input.html}` }
    ]
  })

  const raw = (sectionsResult as any)?.choices?.[0]?.message?.content || "{}"

  let sections: any[] = []
  try {
    const parsed = JSON.parse(raw)
    sections = parsed.sections || []
  } catch (e) {
    error("Failed to parse sections response:", e)
    return { blocks: [], sections: [] }
  }

  // Convert each section to a block
  const blocks = []
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const blockType = section.type

    if (blockType && BlockTypeDescriptions[blockType as keyof typeof BlockTypeDescriptions]) {
      const block = await convertSectionToBlock(section, blockType, input.html || "", i)
      if (block) {
        blocks.push(block)
      }
    }
  }

  return { blocks, sections }
}
