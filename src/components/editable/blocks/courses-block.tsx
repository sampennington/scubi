import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Calendar, Users, Waves, Plus } from "lucide-react"
import type { CoursesContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

import { BlockEditProvider, useBlockEdit } from "@/components/editable/block-edit-context"
import { E } from "@/components/editable/edit-with-context"
import { ShopOwner } from "@/components/ui/shop-ownership-check"
import { useSite } from "@/components/site-context"
import { CoursesSettingsPanel } from "./courses-settings-panel"

const defaultContent: CoursesContent = {
  title: "Set your courses title here",
  description: "Set your courses description here",
  courses: [
    {
      title: "Sample Course",
      description: "Course description",
      duration: "2 hours",
      level: "beginner",
      price: 99,
      currency: "USD"
    }
  ],
  layout: "grid",
  columns: "2",
  showPricing: true,
  showLevels: true
}

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

const CoursesBlockContent = () => {
  const { content, handleEdit } = useBlockEdit<CoursesContent>()

  const { shopId } = useSite()

  const {
    title,
    description,
    courses,
    layout = "grid",
    columns = 3,
    showPricing = true,
    showLevels = true
  } = content

  const addNewCourse = () => {
    const newCourse = {
      title: "New Course",
      description: "Course description",
      duration: "2 hours",
      level: "beginner" as const,
      price: 99,
      currency: "USD"
    }

    handleEdit("courses", [...courses, newCourse])
  }

  const gridCols: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  }

  return (
    <section className="group relative rounded-xl py-16 transition-all duration-200 hover:bg-muted/5 hover:shadow-lg">
      <CoursesSettingsPanel />
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <E.h2 fieldPath="title" className="mb-4 font-bold text-3xl md:text-4xl">
                {title}
              </E.h2>
            )}
            {description && (
              <E.p fieldPath="description" className="text-lg text-muted-foreground">
                {description}
              </E.p>
            )}
          </div>
        )}

        {layout === "grid" && (
          <div className={`grid gap-8 ${gridCols[columns]}`}>
            {courses.map((course, index) => (
              <div key={index} className="rounded-lg border bg-card p-6 shadow-lg">
                <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <E.image
                    fieldPath={`courses[${index}].image`}
                    src={course.image || ""}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="h-full w-full"
                  />
                </div>

                <div className="mb-4 flex items-center justify-between">
                  {showLevels && (
                    <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                  )}
                  {showPricing && (
                    <div className="text-right">
                      <span className="font-bold text-2xl text-primary">${course.price}</span>
                      {course.currency && course.currency !== "USD" && (
                        <span className="text-muted-foreground text-sm">{course.currency}</span>
                      )}
                    </div>
                  )}
                </div>

                <E.h3 fieldPath={`courses[${index}].title`} className="mb-2 font-semibold text-xl">
                  {course.title}
                </E.h3>
                <E.p
                  fieldPath={`courses[${index}].description`}
                  className="mb-4 text-muted-foreground"
                >
                  {course.description}
                </E.p>

                <div className="mb-4 space-y-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <E.span fieldPath={`courses[${index}].duration`}>{course.duration}</E.span>
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

        <ShopOwner shopId={shopId}>
          <div className="mt-8 text-center">
            <Button onClick={addNewCourse} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </div>
        </ShopOwner>

        {layout === "list" && (
          <div className="space-y-6">
            {courses.map((course, index) => (
              <div key={index} className="flex gap-6 rounded-lg border bg-card p-6">
                <div className="h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
                  <E.image
                    fieldPath={`courses[${index}].image`}
                    src={course.image || ""}
                    alt={course.title}
                    width={200}
                    height={150}
                    className="h-full w-full"
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <E.h3 fieldPath={`courses[${index}].title`} className="font-semibold text-xl">
                      {course.title}
                    </E.h3>
                    {showPricing && (
                      <div className="text-right">
                        <span className="font-bold text-2xl text-primary">${course.price}</span>
                        {course.currency && course.currency !== "USD" && (
                          <span className="text-muted-foreground text-sm">{course.currency}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <E.p
                    fieldPath={`courses[${index}].description`}
                    className="mb-3 text-muted-foreground"
                  >
                    {course.description}
                  </E.p>

                  <div className="mb-3 flex flex-wrap gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <E.span fieldPath={`courses[${index}].duration`}>{course.duration}</E.span>
                    </div>

                    {showLevels && (
                      <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
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

export const CoursesBlock = ({
  content = defaultContent,
  blockId
}: {
  content?: CoursesContent
  blockId?: string
}) => {
  return (
    <BlockEditProvider<CoursesContent> blockId={blockId} initialContent={content} type="courses">
      <CoursesBlockContent />
    </BlockEditProvider>
  )
}
