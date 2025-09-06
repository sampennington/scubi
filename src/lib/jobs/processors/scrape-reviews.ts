import { updateJobStatus, getJob } from "../api"
import type { ScrapeReviewsJobInput, ScrapeReviewsJobOutput } from "../types"

export async function processScrapeReviewsJob(
  jobId: string,
  input: ScrapeReviewsJobInput
): Promise<void> {
  try {
    console.log(`Starting review scraping job ${jobId} for URL: ${input.mapsUrl}`)
    
    await updateJobStatus(jobId, "running", { progress: 10 })

    // Get shopId from job
    const jobResult = await getJob(jobId)
    if (!jobResult.success || !jobResult.job) {
      throw new Error("Could not retrieve job details")
    }

    const shopId = jobResult.job.shopId

    console.log(`Scraping reviews for shop ${shopId} from ${input.mapsUrl}`)
    
    // Call the API route to handle browser scraping
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/scrape-reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        shopId,
        mapsUrl: input.mapsUrl
      })
    })

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || "Scraping failed")
    }

    console.log(`Scraping completed successfully via API route`)

  } catch (error) {
    console.error(`Review scraping job ${jobId} failed:`, error)
    await updateJobStatus(jobId, "failed", {
      error: error instanceof Error ? error.message : "Scraping failed"
    })
  }
}