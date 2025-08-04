import Image from "next/image"
import { Badge } from "../ui/badge"
import { Calendar, Waves } from "lucide-react"
import type { MarineLifeContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

const defaultContent: MarineLifeContent = {
  title: "Set your marine life title here",
  items: [
    {
      name: "Sample Marine Life",
      description: "Description of marine life",
      season: "year-round",
      difficulty: "easy"
    }
  ]
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "moderate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "challenging":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getSeasonColor = (season: string) => {
  switch (season) {
    case "spring":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "summer":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "fall":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "winter":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "year-round":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export const MarineLifeBlock = ({
  content = defaultContent
}: {
  content?: MarineLifeContent
}) => {
  const {
    title,
    description,
    items,
    currentSeason,
    layout = "grid",
    columns = 3,
    showSeasonalFilter = false
  } = content

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  const filteredItems = currentSeason
    ? items.filter(
        (item) => item.season === currentSeason || item.season === "year-round"
      )
    : items

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
            {showSeasonalFilter && currentSeason && (
              <div className="mt-4">
                <Badge className={getSeasonColor(currentSeason)}>
                  <Calendar className="mr-1 h-3 w-3" />
                  {currentSeason.charAt(0).toUpperCase() +
                    currentSeason.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        )}

        {layout === "grid" && (
          <div className={`grid gap-6 ${gridCols[columns]}`}>
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 shadow-lg"
              >
                {item.image && (
                  <div className="mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={200}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  </div>
                )}

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <Badge className={getSeasonColor(item.season)}>
                    {item.season === "year-round" ? "Year-round" : item.season}
                  </Badge>
                </div>

                <p className="mb-3 text-sm text-muted-foreground">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {item.depth && (
                    <div className="flex items-center gap-1">
                      <Waves className="h-3 w-3" />
                      <span>{item.depth}</span>
                    </div>
                  )}

                  {item.difficulty && (
                    <Badge className={getDifficultyColor(item.difficulty)}>
                      {item.difficulty}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {layout === "list" && (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-lg border bg-card p-4"
              >
                {item.image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={80}
                      className="h-20 w-32 rounded-lg object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge className={getSeasonColor(item.season)}>
                      {item.season === "year-round"
                        ? "Year-round"
                        : item.season}
                    </Badge>
                  </div>

                  <p className="mb-2 text-muted-foreground text-sm">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
                    {item.depth && (
                      <div className="flex items-center gap-1">
                        <Waves className="h-3 w-3" />
                        <span>{item.depth}</span>
                      </div>
                    )}

                    {item.difficulty && (
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No marine life found for the current season.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
