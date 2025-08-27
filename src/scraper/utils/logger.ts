const LOG_LEVEL = (process.env.SCRAPER_LOG_LEVEL || "info").toLowerCase()
const DEBUG_ENABLED = process.env.SCRAPER_DEBUG === "true" || LOG_LEVEL === "debug"

function ts() {
  return new Date().toISOString()
}

export function info(message: string, meta?: unknown) {
  // Keep concise; optionally attach small meta objects
  if (meta !== undefined) console.log(`[scraper] ${ts()} INFO  ${message}`, meta)
  else console.log(`[scraper] ${ts()} INFO  ${message}`)
}

export function warn(message: string, meta?: unknown) {
  if (meta !== undefined) console.warn(`[scraper] ${ts()} WARN  ${message}`, meta)
  else console.warn(`[scraper] ${ts()} WARN  ${message}`)
}

export function error(message: string, meta?: unknown) {
  if (meta !== undefined) console.error(`[scraper] ${ts()} ERROR ${message}`, meta)
  else console.error(`[scraper] ${ts()} ERROR ${message}`)
}

export function debug(message: string, meta?: unknown) {
  if (!DEBUG_ENABLED) return
  if (meta !== undefined) console.log(`[scraper] ${ts()} DEBUG ${message}`, meta)
  else console.log(`[scraper] ${ts()} DEBUG ${message}`)
}
