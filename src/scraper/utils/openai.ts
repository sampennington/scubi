export type Messages = { role: "system" | "user" | "assistant"; content: string }[]

interface OpenAiChatJsonBody {
  messages: Messages
  model?: string
  temperature?: number
  apiKey?: string
}

export async function openaiChatJson({
  messages,
  model = "gpt-4o-mini",
  temperature = 0.2,
  apiKey = process.env.OPENAI_API_KEY
}: OpenAiChatJsonBody): Promise<unknown> {
  const result = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature,
      response_format: { type: "json_object" },
      messages
    })
  })

  return result.json()
}
