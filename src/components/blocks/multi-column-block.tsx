import type { LucideIcon, LucideProps } from "lucide-react"
import * as Icons from "lucide-react"
import type { MultiColumnBlockContent } from "./types"

const getIconComponent = (iconName: string): LucideIcon | null => {
  const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon
  return IconComponent || null
}

const Icon = ({ name, ...props }: { name: string } & LucideProps) => {
  const IconComponent = getIconComponent(name)

  if (!IconComponent) {
    return null
  }

  return <IconComponent {...props} />
}

export const MultiColumnBlock = ({
  content
}: {
  content: MultiColumnBlockContent
}) => {
  const {
    title,
    description,
    columns,
    columnsPerRow = 3,
    alignment = "center",
    showIcons = true
  } = content

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  const textAlignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className={`mb-12 ${textAlignment[alignment]}`}>
            {title && (
              <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${gridCols[columnsPerRow]}`}>
          {columns.map((column, index) => (
            <div
              key={index}
              className={`flex flex-col ${textAlignment[alignment]}`}
            >
              {showIcons && column.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon name={column.icon} className="h-8 w-8 text-primary" />
                  </div>
                </div>
              )}

              {column.heading && (
                <h3 className="mb-3 font-semibold text-xl">{column.heading}</h3>
              )}

              <p className="text-muted-foreground">{column.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
