import { Card, CardTitle } from "./card"
import { CardHeader } from "./card"
import type { Shop } from "@/lib/api"

export const ShopCard = ({ shop }: { shop: Shop }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{shop.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}
