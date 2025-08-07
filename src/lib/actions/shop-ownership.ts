"use server"

import { api } from "@/lib/api"
import { headers } from "next/headers"
import { auth } from "../auth"

export async function checkShopOwnership(shopId: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return false
    }

    const userShops = await api.shops.getByUserId(session.user.id)
    return userShops.some((shop) => shop.id === shopId)
  } catch (error) {
    console.error("Error checking shop ownership:", error)
    return false
  }
}
