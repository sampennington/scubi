import Image from "next/image"
import type { GalleryBlockContent } from "./types"

export const GalleryBlock = ({ content }: { content: GalleryBlockContent }) => {
  const {
    title,
    description,
    images,
    layout = "grid",
    columns = 3,
    showCaptions = false
  } = content

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
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
          <div className={`grid gap-4 ${gridCols[columns]}`}>
            {(images || []).map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {showCaptions && image.caption && (
                  <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-4 text-white">
                    <p className="text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === "carousel" && (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {(images || []).map((image, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="group relative overflow-hidden rounded-lg">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={300}
                      height={200}
                      className="h-48 w-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {showCaptions && image.caption && (
                      <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-4 text-white">
                        <p className="text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {layout === "masonry" && (
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
            {(images || []).map((image, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <div className="group relative overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {showCaptions && image.caption && (
                    <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-4 text-white">
                      <p className="text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
