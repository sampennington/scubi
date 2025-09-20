# BullMQ Task Queue System

A Redis-backed task queue system using BullMQ for reliable background job processing with real-time progress tracking.

## Overview

This system replaces the previous child process-based task manager with a more robust, scalable solution that provides:

- **Persistent Job Storage**: Jobs are stored in Redis and survive server restarts
- **Automatic Retries**: Failed jobs are retried with exponential backoff
- **Real-time Progress**: Live progress updates via Server-Sent Events
- **Concurrency Control**: Configurable worker concurrency for optimal performance
- **Job Priority & Delays**: Support for prioritized and scheduled jobs

## Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Frontend      │────│  API Routes  │────│  Queue Manager  │
│   (React Hook)  │    │   (SSE)      │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                     │
                                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     BullMQ System                           │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │   Queues    │  │   Workers   │  │    Queue Events      │ │
│  │             │  │             │  │                      │ │
│  │ Redis-based │  │ Processors  │  │ Progress & Status    │ │
│  │ Job Storage │  │             │  │     Updates          │ │
│  └─────────────┘  └─────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │    Redis     │
                        │   Database   │
                        └──────────────┘
```

## Core Components

### 1. Queue Manager (`src/lib/queue/index.ts`)

The main interface for interacting with the queue system:

```typescript
import { queueManager } from '@/lib/queue'

// Add a job
const jobId = await queueManager.addJob('scrape-reviews', {
  mapsUrl: 'https://maps.google.com/...',
  shopId: 'shop-123'
})

// Control job execution
await queueManager.pauseJob('scrape-reviews', jobId)
await queueManager.resumeJob('scrape-reviews', jobId)
await queueManager.removeJob('scrape-reviews', jobId)
```

### 2. Task Queue (`src/lib/queue/task-queue.ts`)

Manages BullMQ queues, workers, and events:

- **Registers task processors** with their queue configurations
- **Handles job lifecycle events** (waiting, active, completed, failed)
- **Emits real-time updates** for frontend consumption
- **Manages worker concurrency** and retry policies

### 3. Job Processors (`src/lib/queue/processors/`)

Self-contained functions that execute the actual work:

```typescript
export async function scrapeReviewsProcessor({
  id,
  data,
  updateProgress
}: {
  id: string
  data: ScrapeReviewsJobData
  updateProgress: (progress: TaskProgress) => Promise<void>
}): Promise<ScrapeReviewsResult> {
  // Job implementation with progress reporting
  await updateProgress({
    percentage: 50,
    current: 5,
    total: 10,
    message: 'Processing reviews...'
  })
  
  return result
}
```

### 4. Connection Management (`src/lib/queue/connection.ts`)

Redis connection configuration with environment variable support:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

## Job Flow

1. **Job Creation**: Frontend calls API to start a job
2. **Queue Addition**: Job is added to Redis queue with metadata
3. **Worker Pickup**: Available worker picks up job for processing
4. **Progress Updates**: Worker reports progress via `updateProgress()`
5. **Event Emission**: Progress events are emitted to listening clients
6. **SSE Streaming**: API routes stream updates to frontend via Server-Sent Events
7. **Completion**: Job completes with result or error

## Adding New Task Types

1. **Define Types** in `types.ts`:
```typescript
export interface NewTaskJobData extends TaskJobData {
  inputField: string
}

export interface NewTaskResult {
  outputField: string
}
```

2. **Create Processor** in `processors/new-task-processor.ts`:
```typescript
export async function newTaskProcessor({
  id,
  data,
  updateProgress
}: {
  id: string
  data: NewTaskJobData
  updateProgress: (progress: TaskProgress) => Promise<void>
}): Promise<NewTaskResult> {
  // Implementation here
}
```

3. **Register Task** in `index.ts`:
```typescript
this.taskQueue.registerTask<NewTaskJobData, NewTaskResult>('new-task', {
  queueName: 'new-task',
  processor: newTaskProcessor
})
```

## Configuration Options

### Queue Options
- `removeOnComplete`: Number of completed jobs to keep (default: 10)
- `removeOnFail`: Number of failed jobs to keep (default: 5)
- `attempts`: Number of retry attempts (default: 3)
- `backoff`: Retry delay strategy (exponential, 2s initial)

### Worker Options
- `concurrency`: Number of concurrent jobs per worker (default: 3)
- Connection settings inherited from Redis configuration

## Monitoring & Debugging

### Job States
- `waiting`: Job queued, waiting for worker
- `active`: Job being processed
- `completed`: Job finished successfully
- `failed`: Job failed after all retries
- `paused`: Job paused by user action

### Event Tracking
All job events are available via the queue manager:
```typescript
queueManager.onTaskUpdate((taskType, jobId, update) => {
  console.log(`Task ${jobId} of type ${taskType}:`, update)
})
```

### Error Handling
- **Automatic Retries**: Failed jobs retry with exponential backoff
- **Dead Letter Queue**: Permanently failed jobs are preserved for debugging
- **Error Reporting**: Detailed error messages in job results

## Environment Requirements

- **Redis**: Required for job storage and coordination
- **Node.js**: Compatible with existing Next.js environment
- **Memory**: Minimal overhead compared to child processes

## Migration from Old System

The new system maintains API compatibility with the existing frontend code. Key improvements:

- ✅ **Persistence**: Jobs survive server restarts
- ✅ **Scalability**: Can run across multiple server instances
- ✅ **Reliability**: Built-in retries and error handling
- ✅ **Performance**: Efficient Redis-based coordination
- ✅ **Monitoring**: Rich event system for observability

## Important Behavioral Changes

- **Job Control**: Unlike the old system, BullMQ doesn't support pausing/resuming individual jobs. Only start and abort (remove) operations are available.
- **Job Removal**: Jobs can be removed individually using the `removeJob` method.
- **Simplified Interface**: The API now only supports the operations that actually work with BullMQ.

## Usage Examples

### Basic Job Execution
```typescript
const { startTask, status, progress, result } = useTask({
  onComplete: (result) => console.log('Done!', result),
  onError: (error) => console.error('Failed:', error)
})

await startTask('scrape-reviews', {
  mapsUrl: 'https://maps.google.com/place/...',
  shopId: 'shop-123'
})
```

### Job Control
```typescript
const { abortTask } = useTask()

await abortTask()  // Cancel/remove specific job
```

**Note**: BullMQ doesn't support pausing/resuming individual jobs. Jobs can only be started or aborted (removed). For more complex job control, you would need to implement it within the job processor itself.

The system is designed to be simple, reliable, and easy to extend with new task types as your application grows.