"use client"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"

interface ReviewProps {
  image: string
  name: string
  userName: string
  comment: string
  rating: number
}

const reviewList: ReviewProps[] = [
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Leah",
    userName: "Dive Instructor – Koh Tao",
    comment:
      "I had no idea how to build a website. Scubi did it in minutes. It looks amazing and I didn't have to lift a finger.",
    rating: 5.0
  },
  {
    image:
      "https://images.unsplash.com/photo-1658281097220-eb7672eed00b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHByb2ZpbGUlMjBwaG90b3xlbnwwfDJ8MHx8fDA%3D",
    name: "Carlos",
    userName: "Dive Shop Owner – Belize",
    comment:
      "I used to rely on Facebook. Now I have a proper dive shop website, and I'm getting more direct bookings every week.",
    rating: 5.0
  },
  {
    image:
      "https://images.unsplash.com/photo-1618018352910-72bdafdc82a6?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Sarah",
    userName: "PADI Instructor – Bali",
    comment:
      "Perfect for busy dive instructors like me. I can focus on teaching while Scubi handles my online presence.",
    rating: 4.9
  },
  {
    image:
      "https://images.unsplash.com/photo-1584999734482-0361aecad844?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHwyfDB8fHww",
    name: "Mike",
    userName: "Liveaboard Owner – Maldives",
    comment:
      "The mobile optimization is incredible. Our guests can easily book trips from their phones while on vacation.",
    rating: 5.0
  },
  {
    image:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2ZpbGUlMjBwaG90b3xlbnwwfDJ8MHx8fDA%3D",
    name: "Emma",
    userName: "New Dive Business – Australia",
    comment:
      "Starting from scratch was so easy. Scubi guided me through everything and my site looks professional from day one.",
    rating: 5.0
  },
  {
    image:
      "https://images.unsplash.com/photo-1623517006691-00db997b4c58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUwfHxwcm9maWxlJTIwcGhvdG98ZW58MHwyfDB8fHww",
    name: "David",
    userName: "Dive Resort Manager – Philippines",
    comment:
      "The SEO optimization is working perfectly. We're ranking higher for local dive searches than ever before.",
    rating: 4.9
  }
]

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container mx-auto px-4 py-24 sm:py-32">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
          What Dive Shop Owners Say
        </h2>

        <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
          Real Stories from Real Dive Businesses
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start"
        }}
        className="relative mx-auto w-[80%] sm:w-[90%] lg:max-w-screen-xl"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem key={review.name} className="md:basis-1/2 lg:basis-1/3">
              <Card className="flex h-full flex-col bg-muted/50">
                <CardContent className="flex flex-grow flex-col">
                  <div className="flex gap-1 pb-4">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  <div className="flex flex-1 items-start pb-4">
                    <p className="text-sm leading-relaxed">{`"${review.comment}"`}</p>
                  </div>
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={review.image} alt="radix" />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
