"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Phone, Calendar } from "lucide-react"
import heroImage from "@/assets/hero-underwater.jpg"
import { Nav } from "./nav"
import { Footer } from "./footer"
import Image from "next/image"
import { About } from "./about"
import { type Course, Courses } from "./courses"
import { SiteSettings } from "@/lib/api/site-settings"

const sampleDiveShop = {
  name: "Coral Paradise Diving",
  subdomain: "coral-paradise",
  customization: {
    primary_color: "#1e40af",
    secondary_color: "#f97316",
    accent_color: "#06b6d4",
    font_family: "Inter"
  },
  content: {
    home: {
      title: "Explore the Underwater Paradise",
      subtitle:
        "Professional dive training and unforgettable underwater adventures",
      body_content:
        "Welcome to Coral Paradise Diving, your gateway to the most spectacular underwater experiences. With over 15 years of expertise, we offer world-class diving courses, guided tours, and equipment rental in some of the most pristine waters on earth.",
      contact_info: {
        phone: "+1 (555) 123-DIVE",
        email: "info@coralparadise.com",
        address: "123 Ocean Drive, Paradise Bay"
      },
      social_links: {
        facebook: "https://facebook.com/coralparadise",
        instagram: "https://instagram.com/coralparadise",
        whatsapp: "+1555123DIVE"
      }
    }
  },
  courses: [
    {
      title: "Open Water Diver",
      description:
        "Your first step into the underwater world. Learn the basics of scuba diving in a safe, fun environment.",
      price: 399,
      duration_days: 3,
      max_depth_meters: 18,
      certification_level: "Beginner"
    },
    {
      title: "Advanced Open Water",
      description:
        "Expand your diving skills with specialized adventure dives and deeper exploration.",
      price: 299,
      duration_days: 2,
      max_depth_meters: 30,
      certification_level: "Intermediate"
    },
    {
      title: "Rescue Diver",
      description:
        "Learn to prevent and manage problems underwater and become a more confident diver.",
      price: 450,
      duration_days: 4,
      max_depth_meters: 30,
      certification_level: "Advanced"
    }
  ],
  reviews: [
    {
      customer_name: "Sarah Johnson",
      rating: 5,
      title: "Amazing Experience!",
      content:
        "The instructors were incredibly professional and made me feel safe throughout the entire course. The underwater world here is absolutely breathtaking!",
      course_taken: "Open Water Diver"
    },
    {
      customer_name: "Mike Chen",
      rating: 5,
      title: "Best Dive Shop Ever",
      content:
        "I've been diving for 10 years and this is hands down the best dive shop I've ever worked with. Equipment is top-notch and the dive sites are incredible.",
      course_taken: "Advanced Open Water"
    },
    {
      customer_name: "Emma Rodriguez",
      rating: 5,
      title: "Life-changing",
      content:
        "Taking my rescue diver course here was life-changing. The instructors pushed me to be my best while keeping everything fun and engaging.",
      course_taken: "Rescue Diver"
    }
  ]
}

const courses: Course[] = [
  {
    title: "Open Water Diver",
    description:
      "Your first step into the underwater world. Learn the basics of scuba diving in a safe, fun environment.",
    price: 399,
    duration_days: 3,
    max_depth_meters: 18,
    certification_level: "Beginner"
  },
  {
    title: "Advanced Open Water",
    description:
      "Expand your diving skills with specialized adventure dives and deeper exploration.",
    price: 299,
    duration_days: 2,
    max_depth_meters: 30,
    certification_level: "Intermediate"
  },
  {
    title: "Rescue Diver",
    description:
      "Learn to prevent and manage problems underwater and become a more confident diver.",
    price: 450,
    duration_days: 4,
    max_depth_meters: 30,
    certification_level: "Advanced"
  }
]

export const DiveShopSite = ({
  currentPage,
  siteSettings
}: {
  currentPage: string
  siteSettings: SiteSettings
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Nav
        setCurrentPage={() => {}}
        currentPage={currentPage}
        name={sampleDiveShop.name}
        siteSettings={siteSettings}
      />

      {/* {renderPage()} */}

      <Footer name={"test"} siteSettings={siteSettings} />
    </div>
  )
}

export default DiveShopSite

// const renderStars = (rating: number) => {
//   return Array.from({ length: 5 }, (_, i) => (
//     <Star
//       key={i}
//       className={`h-4 w-4 ${
//         i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//       }`}
//     />
//   ))
// }

// const renderHomePage = () => (
//   <div>
//     <section className="relative overflow-hidden py-20">
//       <div className="absolute inset-0 z-0">
//         <Image
//           src={heroImage}
//           alt="Underwater scene"
//           className="h-full w-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
//       </div>

//       <div className="container relative z-10 mx-auto px-4">
//         <div className="max-w-3xl text-white">
//           <h1 className="mb-6 font-bold text-5xl md:text-6xl">
//             {sampleDiveShop.content.home.title}
//           </h1>
//           <p className="mb-8 text-white/90 text-xl md:text-2xl">
//             {sampleDiveShop.content.home.subtitle}
//           </p>
//           <div className="flex flex-col gap-4 sm:flex-row">
//             <Button size="lg" variant="secondary">
//               <Calendar className="mr-2 h-5 w-5" />
//               Book Now
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-white text-white hover:bg-white hover:text-primary"
//             >
//               <Phone className="mr-2 h-5 w-5" />
//               Call Us
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>

//     <About body={"Test"} />
//     <Courses courses={courses} />

//     {/* Reviews */}
//     <section className="bg-background py-16">
//       <div className="container mx-auto px-4">
//         <div className="mb-12 text-center">
//           <h2 className="mb-4 font-bold text-4xl">What Our Divers Say</h2>
//           <p className="text-muted-foreground text-xl">
//             Don't just take our word for it
//           </p>
//         </div>

//         <div className="grid gap-8 md:grid-cols-3">
//           {sampleDiveShop.reviews.map((review, index) => (
//             <Card key={index} className="transition-shadow hover:shadow-lg">
//               <CardHeader>
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-ocean font-semibold text-white">
//                     {review.customer_name.charAt(0)}
//                   </div>
//                   <div>
//                     <CardTitle className="text-lg">
//                       {review.customer_name}
//                     </CardTitle>
//                     <div className="flex items-center gap-1">
//                       {renderStars(review.rating)}
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <h4 className="mb-2 font-semibold">{review.title}</h4>
//                 <p className="mb-3 text-muted-foreground">{review.content}</p>
//                 <Badge variant="outline" className="text-xs">
//                   {review.course_taken}
//                 </Badge>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   </div>
// )

// const renderPage = () => {
//   switch (currentPage) {
//     case "home":
//       return renderHomePage()
//   case "about":
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <h1 className="text-4xl font-bold mb-8">About Us</h1>
//         <div className="max-w-4xl">
//           <p className="text-lg text-muted-foreground mb-6">
//             Founded in 2008, Coral Paradise Diving has been dedicated to
//             sharing the wonders of the underwater world with diving
//             enthusiasts from around the globe.
//           </p>
//           <p className="text-lg text-muted-foreground">
//             Our team of experienced instructors and dive masters are
//             passionate about marine conservation and committed to providing
//             safe, educational, and unforgettable diving experiences.
//           </p>
//         </div>
//       </div>
//     )
//   case "courses":
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <h1 className="text-4xl font-bold mb-8">Our Courses</h1>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {courses.map((course, index) => (
//             <Card key={index} className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <Badge variant="outline">
//                     {course.certification_level}
//                   </Badge>
//                   <span className="text-2xl font-bold text-primary">
//                     ${course.price}
//                   </span>
//                 </div>
//                 <CardTitle className="text-xl">{course.title}</CardTitle>
//                 <CardDescription>{course.description}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 text-sm text-muted-foreground mb-4">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     {course.duration_days} days
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Waves className="h-4 w-4" />
//                     Max depth: {course.max_depth_meters}m
//                   </div>
//                 </div>
//                 <Button className="w-full">Book Course</Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     )
//   case "contact":
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
//         <div className="grid md:grid-cols-2 gap-12">
//           <div>
//             <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Phone className="h-5 w-5 text-primary" />
//                 <span>{displayData.content.home.contact_info.phone}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Mail className="h-5 w-5 text-primary" />
//                 <span>{displayData.content.home.contact_info.email}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <MapPin className="h-5 w-5 text-primary" />
//                 <span>{displayData.content.home.contact_info.address}</span>
//               </div>
//             </div>
//           </div>
//           <Card>
//             <CardHeader>
//               <CardTitle>Send us a message</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium">Name</label>
//                 <input className="w-full px-3 py-2 border border-border rounded-md mt-1" />
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border border-border rounded-md mt-1"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Message</label>
//                 <textarea className="w-full px-3 py-2 border border-border rounded-md mt-1 h-24"></textarea>
//               </div>
//               <Button className="w-full">Send Message</Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
// default:
//   return (
//     <div className="container mx-auto px-4 py-16">
//       <h1 className="mb-8 font-bold text-4xl">
//         {currentPage.charAt(0).toUpperCase() +
//           currentPage.slice(1).replace("-", " ")}
//       </h1>
//       <p className="text-lg text-muted-foreground">
//         This page is coming soon. Check back later for exciting content!
//       </p>
//     </div>
//   )
