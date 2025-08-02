import Image from "next/image"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Calendar, Users, Waves } from "lucide-react"
import type { CoursesBlockContent } from "./types"

const getLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export const CoursesBlock = ({ content }: { content: CoursesBlockContent }) => {
  const {
    title,
    description,
    courses,
    layout = "grid",
    columns = 3,
    showPricing = true,
    showLevels = true
  } = content

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

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
          </div>
        )}

        {layout === "grid" && (
          <div className={`grid gap-8 ${gridCols[columns]}`}>
            {courses.map((course, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-6 shadow-lg"
              >
                {course.image && (
                  <div className="mb-4">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={200}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  </div>
                )}

                <div className="mb-4 flex items-center justify-between">
                  {showLevels && (
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  )}
                  {showPricing && (
                    <div className="text-right">
                      <span className="font-bold text-2xl text-primary">
                        ${course.price}
                      </span>
                      {course.currency && course.currency !== "USD" && (
                        <span className="text-muted-foreground text-sm">
                          {course.currency}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="mb-2 font-semibold text-xl">{course.title}</h3>
                <p className="mb-4 text-muted-foreground">
                  {course.description}
                </p>

                <div className="mb-4 space-y-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>

                  {course.maxDepth && (
                    <div className="flex items-center gap-2">
                      <Waves className="h-4 w-4" />
                      <span>Max depth: {course.maxDepth}m</span>
                    </div>
                  )}

                  {course.maxStudents && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Max {course.maxStudents} students</span>
                    </div>
                  )}
                </div>

                {course.includes && course.includes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold">Includes:</h4>
                    <ul className="space-y-1 text-muted-foreground text-sm">
                      {course.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button className="w-full">Book Course</Button>
              </div>
            ))}
          </div>
        )}

        {layout === "list" && (
          <div className="space-y-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="flex gap-6 rounded-lg border bg-card p-6"
              >
                {course.image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={200}
                      height={150}
                      className="h-32 w-48 rounded-lg object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-xl">{course.title}</h3>
                    {showPricing && (
                      <div className="text-right">
                        <span className="font-bold text-2xl text-primary">
                          ${course.price}
                        </span>
                        {course.currency && course.currency !== "USD" && (
                          <span className="text-muted-foreground text-sm">
                            {course.currency}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mb-3 text-muted-foreground">
                    {course.description}
                  </p>

                  <div className="mb-3 flex flex-wrap gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>

                    {showLevels && (
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    )}

                    {course.maxDepth && (
                      <div className="flex items-center gap-2">
                        <Waves className="h-4 w-4" />
                        <span>Max depth: {course.maxDepth}m</span>
                      </div>
                    )}

                    {course.maxStudents && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Max {course.maxStudents} students</span>
                      </div>
                    )}
                  </div>

                  <Button>Book Course</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
