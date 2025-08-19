import type {
  HeroContent,
  TextContent,
  ImageContent,
  DividerContent,
  MultiColumnContent,
  GalleryContent,
  TestimonialsContent,
  TeamContent,
  FAQContent,
  ContactFormContent,
  CallToActionContent,
  VideoContent,
  MapContent,
  SocialFeedContent,
  TwoColumnContent,
  CoursesContent,
  MarineLifeContent,
  ReviewsContent
} from "@/components/blocks/schemas"
import { BlockType } from "@/database/schema"

export const defaultHeroContent: HeroContent = {
  title: "Welcome to our site",
  text: "Discover amazing experiences with us",
  image: "/demo-img.png",
  primaryButton: {
    label: "Get Started",
    url: "#",
    variant: "secondary"
  },
  secondaryButton: {
    label: "Learn More",
    url: "#",
    variant: "outline"
  }
}

export const defaultTextContent: TextContent = {
  text: "Enter your text here",
  alignment: "left"
}

export const defaultImageContent: ImageContent = {
  src: "/demo-img.png",
  alt: "Image description",
  caption: "Optional caption"
}

export const defaultDividerContent: DividerContent = {
  style: "solid",
  color: "#000000",
  thickness: 1
}

export const defaultMultiColumnContent: MultiColumnContent = {
  title: "Our Services",
  description: "Set your multi column description here",
  columns: [
    {
      heading: "Service 1",
      body: "Description of service 1"
    },
    {
      heading: "Service 2",
      body: "Description of service 2"
    },
    {
      heading: "Service 3",
      body: "Description of service 3"
    }
  ],
  columnsPerRow: "3",
  alignment: "center",
  showIcons: true
}

export const defaultGalleryContent: GalleryContent = {
  title: "Our Gallery",
  description: "Browse through our collection",
  images: [
    {
      src: "/demo-img.png",
      alt: "Gallery image 1",
      caption: "Image 1"
    },
    {
      src: "/demo-img.png",
      alt: "Gallery image 2",
      caption: "Image 2"
    },
    {
      src: "/demo-img.png",
      alt: "Gallery image 3",
      caption: "Image 3"
    }
  ],
  layout: "grid",
  columns: "3",
  showCaptions: true
}

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

export const defaultTeamContent: TeamContent = {
  title: "Our Team",
  description: "Meet the people behind our success",
  members: [
    {
      name: "Jane Smith",
      role: "Founder & CEO",
      bio: "Passionate about creating amazing experiences.",
      photo: "/demo-img.png",
      email: "jane@example.com",
      phone: "+1 (555) 123-4567",
      socialLinks: {
        linkedin: "https://linkedin.com/in/janesmith",
        twitter: "https://twitter.com/janesmith",
        instagram: "https://instagram.com/janesmith"
      }
    }
  ],
  layout: "grid"
}

export const defaultFAQContent: FAQContent = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions",
  items: [
    {
      question: "What services do you offer?",
      answer:
        "We offer a wide range of diving services including training, equipment rental, and guided tours."
    }
  ],
  layout: "accordion",
  allowMultipleOpen: true
}

export const defaultContactFormContent: ContactFormContent = {
  title: "Contact Us",
  description: "Get in touch with us",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
      placeholder: "Enter your name"
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
      placeholder: "Enter your email"
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      required: true,
      placeholder: "Enter your message"
    }
  ],
  submitButtonText: "Send Message",
  emailTo: "contact@example.com"
}

export const defaultCallToActionContent: CallToActionContent = {
  title: "Ready to Get Started?",
  description: "Join us for an amazing adventure",
  primaryButton: {
    label: "Book Now",
    url: "#",
    variant: "secondary"
  },
  secondaryButton: {
    label: "Learn More",
    url: "#",
    variant: "outline"
  }
}

export const defaultVideoContent: VideoContent = {
  title: "Watch Our Video",
  description: "See what we're all about",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  provider: "youtube",
  autoplay: false,
  controls: true
}

export const defaultMapContent: MapContent = {
  title: "Find Us",
  description: "Visit our location",
  address: "123 Main St, City, State 12345",
  zoom: 15,
  height: 400,
  showMarker: true
}

export const defaultSocialFeedContent: SocialFeedContent = {
  title: "Follow Us",
  description: "Stay updated with our latest posts",
  platform: "instagram",
  username: "yourusername",
  postCount: 9,
  layout: "grid",
  columns: "3",
  showCaptions: true
}

export const defaultTwoColumnContent: TwoColumnContent = {
  title: "Two Column Layout",
  description: "Content in two columns",
  content: {
    leftContent: {
      type: "text",
      title: "Left Column",
      content: "This is the left column content."
    },
    rightContent: {
      type: "text",
      title: "Right Column",
      content: "This is the right column content."
    },
    layout: "text-text",
    alignment: "top",
    spacing: 0
  }
}

export const defaultCoursesContent: CoursesContent = {
  title: "Our Courses",
  description: "Learn from the best",
  courses: [
    {
      title: "Open Water Course",
      description: "Learn the basics of scuba diving",
      duration: "3-4 days",
      level: "beginner",
      price: 299,
      currency: "USD",
      image: "/demo-img.png"
    }
  ],
  layout: "grid",
  columns: "2",
  showPricing: true,
  showLevels: true
}

export const defaultMarineLifeContent: MarineLifeContent = {
  title: "Marine Life",
  description: "Discover underwater creatures",
  items: [
    {
      name: "Sea Turtle",
      description: "Gentle giants of the sea",
      season: "year-round",
      image: "/demo-img.png",
      depth: "0-30m",
      difficulty: "easy"
    }
  ],
  layout: "grid",
  columns: "2",
  showSeasonalFilter: true
}

export const defaultReviewsContent: ReviewsContent = {
  title: "Customer Reviews",
  description: "See what our customers are saying",
  platform: "all",
  layout: "grid",
  columns: "4",
  maxReviews: 8,
  showRating: true,
  showPhotos: true,
  showVerifiedBadge: true,
  showDate: true,
  showPlatform: false,
  showReadMore: true,
  truncateLength: 150,
  showAggregateRating: true,
  showReviewButton: true,
  reviewButtonText: "Review us on Google",
  reviewButtonUrl: "https://google.com",
  sortBy: "date",
  sortOrder: "desc",
  filterRating: "all",
  autoRefresh: false,
  refreshInterval: 3600
}

export const defaultContent: Partial<Record<BlockType, HeroContent | MultiColumnContent | TeamContent | ContactFormContent | CoursesContent | ReviewsContent>> = {
  [BlockType.HERO]: defaultHeroContent as HeroContent,
  [BlockType.MULTI_COLUMN]: defaultMultiColumnContent as MultiColumnContent,
  [BlockType.TEAM]: defaultTeamContent as TeamContent,
  [BlockType.CONTACT_FORM]: defaultContactFormContent as ContactFormContent,
  [BlockType.COURSES]: defaultCoursesContent as CoursesContent,
  [BlockType.REVIEWS]: defaultReviewsContent as ReviewsContent
}
