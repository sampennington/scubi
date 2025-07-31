import { ShopCard } from "@/components/ui/shop-card"
import { api } from "@/lib/api"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ShopsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  const shops = await api.shops.getByUserId(session.user.id)
  return (
    <div>
      <div className="flex flex-col gap-4">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  )
}
