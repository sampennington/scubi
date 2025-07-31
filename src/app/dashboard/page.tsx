import { api } from "@/lib/api"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Dashboard } from "./dashboard"

export const metadata: Metadata = {
  title: "Dashboard"
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/login")
  }

  const shops = await api.shops.getByUserId(session.user.id)

  return <Dashboard shops={shops} />
}
