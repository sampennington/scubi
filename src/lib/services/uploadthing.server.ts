import { UTApi } from "uploadthing/server"

type UploadData = {
  key: string
  url?: string
  ufsUrl?: string
  appUrl?: string
  name: string
  size: number
  customId?: string | null
}

type UploadResponse =
  | { data: UploadData; error: null }
  | { data: null; error: { code: string; message: string; data: unknown } }

export interface HostedUpload {
  key: string
  url: string
  name: string
  size: number
  customId: string | null
}

let utapiInstance: UTApi | null = null
let missingTokenLogged = false

export function getUploadthingServerClient(): UTApi | null {
  if (!process.env.UPLOADTHING_TOKEN) {
    if (!missingTokenLogged) {
      missingTokenLogged = true
      console.warn(
        "[UploadThing] UPLOADTHING_TOKEN is not configured. Remote uploads will be skipped."
      )
    }

    return null
  }

  if (!utapiInstance) {
    utapiInstance = new UTApi()
  }

  return utapiInstance
}

const normaliseUploadThingResult = (value: unknown): HostedUpload | null => {
  // Handle array response (multiple files)
  if (Array.isArray(value)) {
    const successful = value.find((entry) => entry?.data && !entry?.error)
    return successful ? normaliseUploadThingResult(successful) : null
  }

  // Handle single response with { data, error } structure
  if (value && typeof value === "object" && "data" in value) {
    const response = value as UploadResponse

    if (response.error || !response.data) {
      return null
    }

    const data = response.data
    const url = data.ufsUrl || data.url
    if (!data.key || !url) {
      return null
    }

    return {
      key: data.key,
      url,
      name: data.name,
      size: data.size,
      customId: data.customId || null
    }
  }

  return null
}

interface UploadRemoteFileOptions {
  name?: string
  customId?: string
}

export async function uploadRemoteFile(
  url: string,
  options: UploadRemoteFileOptions = {}
): Promise<HostedUpload | null> {
  const client = getUploadthingServerClient()

  if (!client) {
    return null
  }

  try {
    const result = await client.uploadFilesFromUrl(
      options.name || options.customId
        ? {
            url,
            name: options.name,
            customId: options.customId
          }
        : url
    )

    const upload = normaliseUploadThingResult(result)

    if (!upload) {
      console.error("[UploadThing] Failed to normalise upload response", { url, result })
      return null
    }

    return upload
  } catch (error) {
    console.error("[UploadThing] Error uploading remote file", { url, error })
    return null
  }
}
