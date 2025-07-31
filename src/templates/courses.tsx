import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { Waves } from "lucide-react"

export type Course = {
  title: string
  description: string
  price: number
  duration_days: number
  max_depth_meters: number
  certification_level: string
}

export const Courses = ({ courses }: { courses: Course[] }) => (
  <section className="py-16 bg-muted/20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
        <p className="text-xl text-muted-foreground">
          Start your underwater adventure with our professional training
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {courses.slice(0, 3).map((course, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{course.certification_level}</Badge>
                <span className="text-2xl font-bold text-primary">
                  ${course.price}
                </span>
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {course.duration_days} days
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Max depth: {course.max_depth_meters}m
                </div>
              </div>
              <Button className="w-full mt-4">Learn More</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
)
