// Build script to compile TypeScript workers to JavaScript
import { execSync } from "node:child_process"
import { join } from "node:path"

const workersDir = __dirname
const workers = ["scrape-reviews-worker.ts"]

console.log("Building task workers...")

for (const worker of workers) {
  const inputPath = join(workersDir, worker)

  try {
    execSync(`npx tsx ${inputPath}`, {
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "production" }
    })
    console.log(`✓ Built ${worker}`)
  } catch (error) {
    console.error(`✗ Failed to build ${worker}:`, error)
  }
}

console.log("Workers build complete!")
