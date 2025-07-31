"use client"
import { Card, CardDescription, CardTitle } from "./card"
import { CardHeader } from "./card"
import type { Shop } from "@/lib/api"
import { Button } from "./button"
import { ExternalLink, Pencil } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const ShopCard = ({ shop }: { shop: Shop }) => {
  const router = useRouter()

  const goToPreview = () => {
    router.push(`/preview/${shop.id}/home`)
  }

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

          {/* <Link href={`/preview/${shop.id}/home`} target="_blank"> */}
          <Button variant="secondary" onClick={goToPreview}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          {/* </Link> */}
        </div>
      </CardHeader>
    </Card>
  )
}
