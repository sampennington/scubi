"use client"

import { useEffect, useState } from "react"
import { checkShopOwnership } from "@/lib/actions/shop-ownership"

interface ShopOwnershipCheckProps {
  shopId: string
  children: (isOwner: boolean) => React.ReactNode
}

export const ShopOwnershipCheck = ({
  shopId,
  children
}: ShopOwnershipCheckProps) => {
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

  if (isLoading) {
    return null // Don't show anything while loading
  }

  return <>{children(isOwner)}</>
}
