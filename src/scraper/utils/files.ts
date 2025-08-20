import * as fs from "node:fs"
import * as path from "node:path"

export function writeJsonToTmpScrapes(filename: string, data: unknown) {
  const tmpDir = path.join(process.cwd(), "tmp", "scrapes")
  fs.mkdirSync(tmpDir, { recursive: true })
  const filePath = path.join(tmpDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
  return filePath
}


