"use server"

import { api } from "@/lib/api"
import { authClient } from "../auth-client"

export async function checkShopOwnership(shopId: string): Promise<boolean> {
  try {
    const { data: session } = await authClient.getSession()
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
