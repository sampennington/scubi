"use server"

import { api } from "@/lib/api"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function createShop(data: { name: string; domain: string }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    const shop = await api.shops.create({
      name: data.name,
      slug: data.domain
        .replace("https://", "")
        .replace("http://", "")
        .replace("www.", "")
        .replace(/\./g, "-"),
      createdBy: session.user.id,
      customDomain: data.domain
    })

    revalidatePath("/dashboard/shops")
    return { success: true, shop }
  } catch (error) {
    console.error("Error creating shop:", error)
    return { success: false, error: "Failed to create shop" }
  }
}
