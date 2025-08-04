import { BlockType } from "@/database/schema"

export function getRequiredFields(blockType: string) {
  switch (blockType) {
    case BlockType.HERO:
      return ["title", "text", "image", "primaryButton"]
    case BlockType.TEXT:
      return ["text"]
    case BlockType.IMAGE:
      return ["src", "alt"]
    case BlockType.MULTI_COLUMN:
      return ["title", "columns"]
    case BlockType.GALLERY:
      return ["title", "images"]
    case BlockType.TESTIMONIALS:
      return ["title", "testimonials"]
    case BlockType.TEAM:
      return ["title", "members"]
    case BlockType.FAQ:
      return ["title", "items"]
    case BlockType.CONTACT_FORM:
      return ["title", "description", "email"]
    case BlockType.CALL_TO_ACTION:
      return ["title", "text", "buttonText", "buttonUrl"]
    case BlockType.VIDEO:
      return ["title", "description", "url"]
    case BlockType.MAP:
      return ["title", "address"]
    case BlockType.SOCIAL_FEED:
      return ["title", "platform", "username"]
    case BlockType.DIVIDER:
      return []
    case BlockType.TWO_COLUMN:
      return ["title", "leftContent", "rightContent"]
    case BlockType.COURSES:
      return ["title", "courses"]
    case BlockType.MARINE_LIFE:
      return ["title", "species"]
    default:
      return []
  }
}

export const getDefaultContent = (blockType: string) => {
  switch (blockType) {
    case BlockType.HERO:
      return {
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
    case BlockType.TEXT:
      return { text: "Enter your text here" }
    case BlockType.IMAGE:
      return {
        src: "/demo-img.png",
        alt: "Image description",
        caption: "Optional caption"
      }
    case BlockType.DIVIDER:
      return {
        style: "solid",
        color: "#000000",
        thickness: 1
      }
    case BlockType.MULTI_COLUMN:
      return {
        title: "Our Services",
        columns: [
          {
            title: "Service 1",
            content: "Description of service 1"
          },
          {
            title: "Service 2",
            content: "Description of service 2"
          },
          {
            title: "Service 3",
            content: "Description of service 3"
          }
        ]
      }
    case BlockType.GALLERY:
      return {
        title: "Our Gallery",
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
        ]
      }
    case BlockType.TESTIMONIALS:
      return {
        title: "What Our Customers Say",
        testimonials: [
          {
            name: "John Doe",
            role: "Customer",
            content: "Amazing experience! Highly recommended.",
            avatar: "/demo-img.png"
          }
        ]
      }
    case BlockType.TEAM:
      return {
        title: "Our Team",
        members: [
          {
            name: "Jane Smith",
            role: "Founder & CEO",
            bio: "Passionate about creating amazing experiences.",
            image: "/demo-img.png",
            email: "jane@example.com"
          }
        ]
      }
    case BlockType.FAQ:
      return {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "What services do you offer?",
            answer:
              "We offer a wide range of diving services including training, equipment rental, and guided tours."
          }
        ]
      }
    case BlockType.CONTACT_FORM:
      return {
        title: "Contact Us",
        description: "Get in touch with us",
        email: "contact@example.com"
      }
    case BlockType.CALL_TO_ACTION:
      return {
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
    case BlockType.VIDEO:
      return {
        title: "Watch Our Video",
        description: "See what we're all about",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        provider: "youtube",
        autoplay: false,
        controls: true
      }
    case BlockType.MAP:
      return {
        title: "Find Us",
        description: "Visit our location",
        address: "123 Main St, City, State 12345",
        zoom: 15,
        height: 400,
        showMarker: true
      }
    case BlockType.SOCIAL_FEED:
      return {
        title: "Follow Us",
        description: "Stay updated with our latest posts",
        platform: "instagram",
        username: "yourusername",
        postCount: 9,
        layout: "grid",
        columns: 3,
        showCaptions: true
      }
    case BlockType.TWO_COLUMN:
      return {
        title: "Two Column Layout",
        description: "Content in two columns",
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
    case BlockType.COURSES:
      return {
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
            instructor: "John Doe"
          }
        ],
        layout: "grid",
        columns: 2,
        showPricing: true,
        showLevels: true
      }
    case BlockType.MARINE_LIFE:
      return {
        title: "Marine Life",
        description: "Discover underwater creatures",
        species: [
          {
            name: "Sea Turtle",
            description: "Gentle giants of the sea",
            habitat: "Coral reefs",
            image: "/demo-img.png",
            scientificName: "Chelonia mydas"
          }
        ]
      }
    default:
      return {}
  }
}
