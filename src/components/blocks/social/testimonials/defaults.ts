import type { TestimonialsContent } from "../../shared/schemas"

export const defaultTestimonialsContent: TestimonialsContent = {
  title: "What Our Customers Say",
  description: "Hear from our satisfied customers",
  testimonials: [
    {
      name: "John Doe",
      role: "Customer", 
      company: "ABC Company",
      content: "Amazing experience! Highly recommended.",
      rating: "5",
      photo: "/demo-img.png"
    }
  ],
  layout: "grid",
  columns: "2", 
  showPhotos: true,
  showRatings: true
}