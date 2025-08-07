"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { checkShopOwnership } from "@/lib/actions/shop-ownership"

interface ShopOwnerProps {
  shopId: string
  children: React.ReactNode
}

export const ShopOwner: React.FC<ShopOwnerProps> = ({ shopId, children }) => {
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const ownsShop = await checkShopOwnership(shopId)
        setIsOwner(ownsShop)
      } catch (error) {
        console.error("Error checking shop ownership:", error)
        setIsOwner(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkOwnership()
  }, [shopId])

  if (isLoading || !isOwner) {
    return null
  }

  return children
}
