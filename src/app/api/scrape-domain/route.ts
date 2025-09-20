import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getTaskManager } from "@/lib/queue/manager"

export interface ScrapedSiteData {
  name: string
  description?: string
  address?: string
  phoneNumber?: string
  email?: string
  facebookUrl?: string
  instagramUrl?: string
  whatsappUrl?: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  images?: string[]
  pages?: Array<{
    title: string
    url: string
    content?: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { domain } = await request.json()

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ success: false, error: "Domain is required" }, { status: 400 })
    }

    const normalizedDomain = domain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "")

    // Start the scraping task
    const taskManager = await getTaskManager()
    const taskId = await taskManager.addScraperTask(normalizedDomain)

    return NextResponse.json({
      success: true,
      taskId,
      domain: normalizedDomain,
      message: "Scraping task started. Use the taskId to track progress via SSE."
    })
  } catch (error) {
    console.error("Error starting scraper task:", error)
    return NextResponse.json({ success: false, error: "Failed to start scraping task" }, { status: 500 })
  }
}
