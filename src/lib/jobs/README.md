# Job Queue System

A background job processing system for long-running tasks like web scraping, data exports, and report generation.

## Architecture

```
Queue System
├── queue.ts        - Core queue functions (enqueue, status)
├── processors/     - Job processors by type
│   ├── index.ts       - Processor registry
│   └── scrape-reviews.ts - Example processor
├── actions.ts      - Next.js server actions
├── use-job.ts      - React hook for job management
├── api.ts          - Database operations
└── types.ts        - TypeScript definitions
```

## Basic Usage

### 1. Creating a New Job Type

First, add your job type to the types:

```typescript
// types.ts
export type JobType = "scrape_reviews" | "export_data" | "your_new_job"

export interface YourJobInput {
  param1: string
  param2: number
}

export interface YourJobOutput {
  result: string
  count: number
}
```

### 2. Create a Job Processor

```typescript
// processors/your-job.ts
import { updateJobStatus } from "../api"
import type { YourJobInput, YourJobOutput } from "../types"

export async function processYourJob(
  jobId: string,
  input: YourJobInput
): Promise<void> {
  try {
    await updateJobStatus(jobId, "running", { progress: 0 })

    // Your job logic here
    const result = await doSomeWork(input.param1)
    
    await updateJobStatus(jobId, "running", { progress: 50 })
    
    // More work...
    const finalResult = await doMoreWork(result)
    
    const output: YourJobOutput = {
      result: finalResult,
      count: 42
    }

    await updateJobStatus(jobId, "completed", {
      progress: 100,
      output
    })
  } catch (error) {
    await updateJobStatus(jobId, "failed", {
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
```

### 3. Register the Processor

```typescript
// processors/index.ts
import { processYourJob } from "./your-job"

const processors: Record<JobType, JobProcessor> = {
  scrape_reviews: (jobId: string, input: unknown) => 
    processScrapeReviewsJob(jobId, input as ScrapeReviewsJobInput),
  your_new_job: (jobId: string, input: unknown) =>
    processYourJob(jobId, input as YourJobInput)
}
```

### 4. Create Server Actions

```typescript
// actions.ts
export async function enqueueYourJob(
  shopId: string,
  input: YourJobInput
) {
  "use server"
  return enqueueJob("your_new_job", shopId, input)
}
```

## Using Jobs in Components

### With the useJob Hook (Recommended)

```typescript
import { useJob, enqueueYourJob } from "@/lib/jobs"

function MyComponent() {
  const job = useJob<YourJobInput, YourJobOutput>({
    onComplete: (job) => {
      toast.success(`Job completed! Result: ${job.output?.result}`)
    },
    onError: (error) => {
      toast.error(`Job failed: ${error}`)
    }
  })

  const handleStartJob = async () => {
    const result = await enqueueYourJob(shopId, {
      param1: "value",
      param2: 123
    })

    if (result.success && result.jobId) {
      job.startJob(result.jobId)
    }
  }

  return (
    <div>
      <button onClick={handleStartJob}>Start Job</button>
      
      {job.showJobStatus && job.currentJobId && (
        <JobStatus
          jobId={job.currentJobId}
          onComplete={job.handleJobComplete}
          onError={job.handleJobError}
        />
      )}
    </div>
  )
}
```

### Direct API Usage

```typescript
import { enqueueJob, getJobStatus } from "@/lib/jobs"

// Start a job
const result = await enqueueJob("your_new_job", shopId, input)

// Check status
const status = await getJobStatus(result.jobId!)
```

## Job Status Component

The `JobStatus` component provides a ready-to-use UI for displaying job progress:

```typescript
import { JobStatus } from "@/components/ui/job-status"

<JobStatus
  jobId={jobId}
  onComplete={(job) => console.log("Done!", job.output)}
  onError={(error) => console.log("Failed:", error)}
/>
```

Features:
- Real-time progress updates (polls every 2 seconds)
- Status indicators (pending, running, completed, failed)
- Progress bar for running jobs
- Success/error messages
- Automatic cleanup when job completes

## Job States

- **pending**: Job created but not yet started
- **running**: Job is currently being processed
- **completed**: Job finished successfully
- **failed**: Job encountered an error

## Database Schema

Jobs are stored with the following structure:

```typescript
interface Job<TInput = unknown, TOutput = unknown> {
  id: string
  type: JobType
  status: JobStatus
  shopId: string
  input: TInput
  output?: TOutput
  progress: number
  error?: string
  createdAt: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
}
```

## Best Practices

### Error Handling
- Always wrap processor logic in try-catch
- Use descriptive error messages
- Update job status to "failed" on errors

### Progress Updates
- Update progress regularly for long-running jobs
- Use meaningful progress percentages (0-100)
- Include intermediate status updates

### Type Safety
- Use generic types for job input/output
- Define interfaces for your job data
- Leverage TypeScript for better DX

### Performance
- Keep job processors lightweight
- Use background processing for heavy operations
- Consider pagination for large data sets

## Examples

See the existing `scrape-reviews` processor for a complete example of:
- Job input/output types
- Progress tracking
- Error handling
- Integration with React components