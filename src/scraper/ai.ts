import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { type BlockType, BlockTypeDescriptions } from "@/database/schema"
import { BlockSchemas } from "@/components/blocks/schemas"
import { error, warn } from "@/scraper/utils/logger"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

type Section = {
  type: BlockType
  title: "string"
  contentText: "string"
  images: [
    {
      url: "string"
      alt: "string"
      width: "number"
      height: "number"
      description: "string"
    }
  ]
  confidence: "number"
  rationale: "string"
  html: "string"
}
// TODO: Add schema to this message somehow. Also redo the message a bit it sucks.
async function convertSectionToBlock(
  section: Section,
  blockType: string,
  html: string,
  order: number
) {
  const blockSchema = BlockSchemas[blockType as keyof typeof BlockSchemas]

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

Please convert this section into a ${blockType} block content object.`

  console.log("SYSTEM PROMPT:", systemPrompt)
  console.log("USER PROMPT:", userPrompt)

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_object"
        // json_schema: {
        //   name: "block",
        //   schema: zodToJsonSchema(blockSchema)
        // }
      },
      temperature: 0.2
    })

    const rawContent = completion.choices[0]?.message?.content || "{}"

    // Parse the content and validate against schema
    const parsedContent = JSON.parse(rawContent)
    console.log("PARSED CONTENT:", parsedContent)
    const validation = blockSchema.safeParse(parsedContent)
    console.log("VALIDATION:", validation)

    if (!validation.success) {
      warn(`Block content validation failed for ${blockType}:`, validation.error.message)
      return null
    }

    return {
      type: blockType,
      order,
      content: validation.data,
      confidence: section.confidence
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

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sectionSystemPrompt },
        { role: "user", content: `HTML: ${input.html}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    })

    const raw = completion.choices[0]?.message?.content || "{}"

    let sections: Section[] = []
    try {
      const parsed = JSON.parse(raw)
      console.log("SECTIONS:", parsed)
      sections = parsed.sections || []
    } catch (e) {
      error("Failed to parse sections response:", e)
      return { blocks: [], sections: [] }
    }

    const blocks = []
    for (let i = 0; i < 1; i++) {
      // CHANGE THIS BACK TO sections.length
      const section = sections[i]
      const blockType = section.type

      console.log("SECTION:", section)
      const block = await convertSectionToBlock(section, blockType, input.html || "", i)

      if (block) {
        blocks.push(block)
      }
    }

    return { blocks, sections }
  } catch (e) {
    error("Failed to extract sections:", e)
    return { blocks: [], sections: [] }
  }
}
