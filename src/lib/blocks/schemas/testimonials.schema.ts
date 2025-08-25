import { z } from "zod"

export const TestimonialSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string(),
  rating: z.enum(["1", "2", "3", "4", "5"]),
  photo: z.string().optional()
})

export const TestimonialsContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  testimonials: z.array(TestimonialSchema),
  layout: z.enum(["grid", "carousel"]).optional(),
  columns: z.enum(["2", "3"]).optional(),
  showPhotos: z.boolean().optional(),
  showRatings: z.boolean().optional()
})

export type Testimonial = z.infer<typeof TestimonialSchema>
export type TestimonialsContent = z.infer<typeof TestimonialsContentSchema>

export function isTestimonialsContent(data: unknown): data is TestimonialsContent {
  return TestimonialsContentSchema.safeParse(data).success
}