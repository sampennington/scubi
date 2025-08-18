import { Card, CardDescription, CardTitle } from "./card"
import { CardHeader } from "./card"
import type { Shop } from "@/lib/api"
import { Button } from "./button"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { PreviewButton } from "@/app/dashboard/components/PreviewButton"

export const ShopCard = ({ shop }: { shop: Shop }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{shop.name}</CardTitle>
        <CardDescription>
          <span className="font-medium">Domain:</span> {shop.customDomain}
        </CardDescription>
        <CardDescription>
          <span className="font-medium">Created:</span>{" "}
          {new Date(shop.createdAt).toLocaleDateString()}
        </CardDescription>

        <div className="mt-2 flex gap-2">
          <Link href={`/dashboard/shops/${shop.id}`}>
            <Button variant="default">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>

          <PreviewButton shopId={shop.id} />
        </div>
      </CardHeader>
    </Card>
  )
}
