import { createJob, getJob, updateJobStatus } from "./api"
import type { JobType, Job } from "./types"
import { getJobProcessor } from "./processors"

export async function enqueueJob<TInput>(
  type: JobType,
  shopId: string,
  input: TInput
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  const result = await createJob(type, shopId, input)

  if (result.success && result.jobId) {
    processJobInBackground(result.jobId)
  }

  return result
}

export async function getJobStatus(
  jobId: string
): Promise<{ success: boolean; job?: Job; error?: string }> {
  return await getJob(jobId)
}

async function processJobInBackground(jobId: string) {
  setTimeout(async () => {
    try {
      const jobResult = await getJob(jobId)
      if (!jobResult.success || !jobResult.job) {
        return
      }

      const job = jobResult.job

      await updateJobStatus(jobId, "running", { progress: 0 })

      const processor = getJobProcessor(job.type)
      await processor(jobId, job.input)
    } catch (error) {
      console.error("Error processing job:", error)
      await updateJobStatus(jobId, "failed", {
        error: error instanceof Error ? error.message : "Unknown error"
      })
    }
  }, 1000)
}
