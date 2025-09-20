# SSE Task System

A real-time background task processing system using Server-Sent Events (SSE) for live progress updates and child processes for task isolation.

## Architecture

```
SSE Task System
├── task-manager.ts          - Central task orchestration
├── types.ts                 - TypeScript definitions
├── use-task.ts             - React hook for SSE integration
├── workers/                - Child process workers
│   ├── scrape-reviews-worker.js   - Node.js wrapper (spawned)
│   ├── scrape-reviews-worker.ts   - TypeScript implementation
│   └── build-workers.ts           - Build script
└── api/tasks/[taskType]/
    └── route.ts            - Generic SSE API routes
```

## Key Benefits Over Job Queue

- ✅ **Real-time updates** - No polling, instant progress via SSE
- ✅ **Task control** - Pause/resume/abort functionality
- ✅ **Process isolation** - Each task runs in separate child process
- ✅ **Better UX** - Live progress bars, connection indicators
- ✅ **TypeScript first** - Full type safety throughout
- ✅ **Playwright integration** - Modern scraping with built-in locators

## Basic Usage

### 1. Creating a New Task Type

First, add your task type to the types and task manager:

```typescript
// types.ts
export interface YourTaskInput {
  param1: string
  param2: number
}

export interface YourTaskOutput {
  result: string
  count: number
}
```

```typescript
// task-manager.ts - Update the scripts mapping
private getTaskScript(taskType: string): string {
  const scripts: Record<string, string> = {
    "scrape-reviews": require.resolve("./workers/scrape-reviews-worker.js"),
    "your-task": require.resolve("./workers/your-task-worker.js"), // Add this
  }
  // ...
}
```

### 2. Create a Worker Implementation

Create two files for your worker:

```typescript
// workers/your-task-worker.ts
import type { YourTaskInput, YourTaskOutput, TaskUpdate } from '../types'

interface ScrapedData {
  // Your data structure
}

class YourTaskWorker {
  private taskId!: string
  private isPaused = false
  private isAborted = false

  async init(config: { taskId: string; input: YourTaskInput }) {
    this.taskId = config.taskId
    
    try {
      await this.execute(config.input)
    } catch (error) {
      this.sendUpdate({
        type: 'error',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private async execute(input: YourTaskInput) {
    const { param1, param2 } = input

    if (this.isAborted) return

    // Step 1
    this.sendUpdate({
      type: 'status',
      status: 'running',
      message: 'Starting task...',
      progress: { percentage: 10, current: 1, total: 5, message: 'Initializing' }
    })

    await this.checkPauseOrAbort()

    // Step 2 - Your work here
    this.sendUpdate({
      type: 'progress',
      message: 'Processing data...',
      progress: { percentage: 50, current: 3, total: 5, message: 'Processing' }
    })

    const result = await this.doWork(param1, param2)

    await this.checkPauseOrAbort()

    // Complete
    const output: YourTaskOutput = {
      result: result.data,
      count: result.count
    }

    this.sendUpdate({
      type: 'result',
      status: 'completed',
      message: `Successfully processed ${result.count} items`,
      progress: { percentage: 100, current: 5, total: 5, message: 'Complete' },
      result: output
    })
  }

  private async doWork(param1: string, param2: number) {
    // Your task logic here
    return { data: `processed-${param1}`, count: param2 }
  }

  private async checkPauseOrAbort() {
    if (this.isAborted) {
      process.exit(0)
    }

    while (this.isPaused && !this.isAborted) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  private sendUpdate(update: Partial<TaskUpdate>) {
    if (process.send) {
      process.send({
        timestamp: new Date().toISOString(),
        taskId: this.taskId,
        ...update
      })
    }
  }

  async abort() {
    this.isAborted = true
    this.sendUpdate({
      type: 'status',
      status: 'aborted',
      message: 'Task aborted'
    })
    process.exit(0)
  }
}

// Worker instance
const worker = new YourTaskWorker()

// Handle messages from parent process
process.on('message', async (message: any) => {
  switch (message.type) {
    case 'init':
      await worker.init(message.config)
      break
    case 'pause':
      worker.pause()
      break
    case 'resume':
      worker.resume()
      break
    case 'abort':
      await worker.abort()
      break
  }
})

// Handle process termination
process.on('SIGTERM', async () => {
  await worker.abort()
})
```

```javascript
// workers/your-task-worker.js (Node.js wrapper)
#!/usr/bin/env node

const path = require("node:path")
const { spawn } = require("node:child_process")

const tsWorkerPath = path.join(__dirname, "your-task-worker.ts")

const worker = spawn("npx", ["tsx", tsWorkerPath], {
  stdio: ["pipe", "inherit", "inherit", "ipc"],
  env: { ...process.env, NODE_ENV: "production" }
})

process.on("message", (message) => {
  worker.send(message)
})

worker.on("message", (message) => {
  if (process.send) {
    process.send(message)
  }
})

process.on("SIGTERM", () => {
  worker.kill("SIGTERM")
})

worker.on("exit", (code) => {
  process.exit(code)
})
```

### 3. Using Tasks in Components

```typescript
import { useTask } from '@/lib/tasks/use-task'
import type { YourTaskInput, YourTaskOutput } from '@/lib/tasks/types'

function MyComponent() {
  const task = useTask({
    onComplete: (result: unknown) => {
      const output = result as YourTaskOutput
      toast.success(`Task completed! Result: ${output.result}`)
    },
    onError: (error: string) => {
      toast.error(`Task failed: ${error}`)
    }
  })

  const handleStartTask = async () => {
    await task.startTask('your-task', {
      param1: 'value',
      param2: 123
    } as YourTaskInput)
  }

  return (
    <div>
      <button onClick={handleStartTask}>Start Task</button>
      
      {task.taskId && task.status !== 'idle' && (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              task.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {task.isConnected ? 'Connected' : 'Disconnected'}
          </div>

          {/* Progress Bar */}
          {task.progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{task.progress.message}</span>
                <span>{task.progress.percentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div 
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${task.progress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Task Controls */}
          <div className="flex gap-2">
            {task.status === 'running' && (
              <button onClick={() => task.pauseTask()}>Pause</button>
            )}
            {task.status === 'paused' && (
              <button onClick={() => task.resumeTask()}>Resume</button>
            )}
            <button onClick={() => task.abortTask()}>Abort</button>
          </div>

          {/* Status Messages */}
          {task.message && <p>{task.message}</p>}
          {task.error && <p className="text-red-600">{task.error}</p>}
        </div>
      )}
    </div>
  )
}
```

## API Endpoints

All task types use the same generic API routes:

- `POST /api/tasks/{taskType}` - Start new task
- `GET /api/tasks/{taskType}?taskId=xxx` - SSE stream for updates
- `POST /api/tasks/{taskType}` (with `action: 'pause'`) - Pause task
- `POST /api/tasks/{taskType}` (with `action: 'resume'`) - Resume task
- `DELETE /api/tasks/{taskType}?taskId=xxx` - Abort task

### Request/Response Examples

**Start Task:**
```javascript
POST /api/tasks/your-task
{
  "param1": "value",
  "param2": 123
}

// Response:
{
  "success": true,
  "taskId": "abc123",
  "message": "your-task task started"
}
```

**SSE Updates:**
```javascript
GET /api/tasks/your-task?taskId=abc123

// Streams:
data: {"type":"status","taskId":"abc123","status":"running","message":"Starting task...","progress":{"percentage":10}}
data: {"type":"progress","taskId":"abc123","message":"Processing...","progress":{"percentage":50}}  
data: {"type":"result","taskId":"abc123","status":"completed","result":{"result":"success","count":5}}
```

## Task States

- **idle**: Initial state, not started
- **running**: Task is actively processing
- **paused**: Task temporarily stopped (can resume)
- **completed**: Task finished successfully  
- **failed**: Task encountered an error
- **aborted**: Task was cancelled by user

## Best Practices

### Worker Implementation
- Use TypeScript for the actual worker logic
- Always implement pause/resume/abort functionality
- Send regular progress updates for long-running tasks
- Use proper error handling with try-catch blocks
- Clean up resources (close browsers, files, etc.) on abort

### Progress Updates
- Use meaningful progress percentages (0-100)
- Include descriptive messages for each step
- Update `current` and `total` for step tracking
- Send updates regularly but not too frequently (every 1-5% or major step)

### Error Handling
- Catch all errors and send proper error updates
- Use descriptive error messages for debugging
- Consider partial success scenarios
- Always clean up on errors

### Playwright Integration
- Use built-in locators instead of `page.evaluate()`
- Implement proper retry logic with `.catch()` methods
- Use semantic selectors (getByRole, getByText, etc.)
- Handle network timeouts and page load failures

## Migration from Job Queue

The SSE task system replaces the old job queue system:

| Job Queue | SSE Tasks |
|-----------|-----------|
| `enqueueJob()` | `task.startTask()` |
| `useJob` hook | `useTask` hook |
| `JobStatus` component | Built into `useTask` |
| Polling for updates | Real-time SSE updates |
| Server actions | API routes |
| Database-based queue | In-memory with child processes |

## Examples

- **Reviews Scraping**: See `scrape-reviews-worker.ts` for a complete Playwright scraping implementation
- **React Integration**: See `add-block-modal.tsx` for real-time UI integration
- **API Usage**: See `route.ts` for generic SSE endpoint handling

## Debugging

- **Worker logs**: Check console output from child processes
- **SSE connection**: Use browser DevTools Network tab to see SSE stream
- **Task manager**: Add logging to `task-manager.ts` for debugging task lifecycle
- **Progress tracking**: Add console.log in workers to track execution flow