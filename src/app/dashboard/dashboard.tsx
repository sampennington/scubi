import { PageHeader } from "@/components/layout/page-header"
import type { Shop } from "@/lib/api"
import { ShopCard } from "@/components/ui/shop-card"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export const Dashboard = ({ shops }: { shops: Shop[] }) => {
  const emptyState = shops.length === 0

  const handleCreateShop = async () => {
    redirect("/create")
  }

  if (emptyState) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Welcome to your dashboard! 👋"
          description="Get started by creating your shop."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={handleCreateShop}>Create Shop</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hi, Welcome back 👋"
        description="Here's what's happening with your account today."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  )
}
