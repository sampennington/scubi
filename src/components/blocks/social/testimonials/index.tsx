import Image from "next/image"
import { Star } from "lucide-react"
import type { TestimonialsContent } from "../../shared/schemas"
import { defaultTestimonialsContent } from "./defaults"

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
    />
  ))
}

export const TestimonialsBlock = ({
  content = defaultTestimonialsContent
}: {
  content?: TestimonialsContent
}) => {
  const {
    title,
    description,
    testimonials,
    layout = "grid",
    columns = 3,
    showPhotos = true,
    showRatings = true
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
            {title && <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        {layout === "grid" && (
          <div className={`grid gap-8 ${gridCols[columns]}`}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-lg bg-card p-6 shadow-lg">
                {showRatings && (
                  <div className="mb-4 flex items-center gap-1">
                    {renderStars(parseInt(testimonial.rating))}
                  </div>
                )}

                <p className="mb-6 text-muted-foreground">"{testimonial.content}"</p>

                <div className="flex items-center gap-4">
                  {showPhotos && testimonial.photo && (
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    {testimonial.role && (
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {layout === "carousel" && (
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="w-80 rounded-lg bg-card p-6 shadow-lg">
                    {showRatings && (
                      <div className="mb-4 flex items-center gap-1">
                        {renderStars(parseInt(testimonial.rating))}
                      </div>
                    )}

                    <p className="mb-6 text-muted-foreground">"{testimonial.content}"</p>

                    <div className="flex items-center gap-4">
                      {showPhotos && testimonial.photo && (
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
                          <Image
                            src={testimonial.photo}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        {testimonial.role && (
                          <p className="text-muted-foreground text-sm">
                            {testimonial.role}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
