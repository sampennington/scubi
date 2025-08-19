import type React from "react"
import { useSite } from "@/app/preview/components/site-context"

interface ShopOwnerProps {
  children: React.ReactNode
}

export const ShopOwner: React.FC<ShopOwnerProps> = ({ children }) => {
  const { isShopOwner } = useSite()

  if (!isShopOwner) {
    return null
  }

  return <>{children}</>
}
