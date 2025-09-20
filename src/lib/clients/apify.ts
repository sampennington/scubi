import { ApifyClient } from "apify-client"

export const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN
})

export interface ApifyRunOptions {
  actorId: string
  input: Record<string, unknown>
  timeout?: number
}

export async function runApifyActor<T = unknown>(options: ApifyRunOptions): Promise<T[]> {
  const { actorId, input, timeout = 300000 } = options

  const run = await apifyClient.actor(actorId).call(input, { timeout })
  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems()

  return items as T[]
}

export const APIFY_ACTORS = {
  GOOGLE_MAPS_SCRAPER: "Xb8osYTtOjlsgI6k9",
  WEB_SCRAPER: "apify/web-scraper",
  GOOGLE_SEARCH_RESULTS: "apify/google-search-results-scraper",
  INSTAGRAM_SCRAPER: "shu8hvrXbJbY3Eb9W"
} as const
