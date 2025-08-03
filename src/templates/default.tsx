"use client"
import heroImage from "@/assets/hero-underwater.jpg"
import { Nav } from "./nav"
import { Footer } from "./footer"
import type { Block, Page } from "../lib/api"
import { BlockRenderer } from "@/components/blocks/block-renderer"
import { ThemeProvider } from "@/components/blocks/theme-provider"
import type { SiteSettings } from "@/lib/api/types"
import { BlockType } from "@/database/schema"

export const DiveShopSite = ({
  currentPage,
  pages,
  siteSettings,
  blocks
}: {
  currentPage: Page
  pages: Page[]
  siteSettings: SiteSettings
  blocks: Block[]
}) => {
  return (
    <ThemeProvider
      theme={{
        primaryColor: siteSettings.primaryColor || "#3b82f6",
        secondaryColor: siteSettings.secondaryColor || "#64748b",
        accentColor: siteSettings.accentColor || "#f59e0b",
        fontFamilyHeading: siteSettings.fontFamilyHeading || undefined,
        fontFamilyBody: siteSettings.fontFamilyBody || undefined
      }}
    >
      <div className="flex min-h-screen flex-col bg-background">
        <Nav
          setCurrentPage={() => {}}
          currentPage={currentPage}
          siteSettings={siteSettings}
          pages={pages}
        />

        <main className="flex-1">
          <BlockRenderer blocks={exampleBlocks} />
        </main>

        <Footer siteSettings={siteSettings} />
      </div>
    </ThemeProvider>
  )
}

const exampleBlocks: Block[] = [
  {
    id: "1",
    pageId: "1",
    type: BlockType.HERO,
    content: {
      title: "Koh Tao Divers",
      text: "Diving Sucks, you into another world",
      image: heroImage,
      primaryButton: {
        label: "Book Now",
        url: "/booking",
        variant: "secondary"
      },
      secondaryButton: {
        label: "Learn More",
        url: "/about",
        variant: "default"
      }
    },
    order: 1,
    updatedAt: new Date()
  },
  {
    id: "2",
    pageId: "1",
    type: BlockType.MULTI_COLUMN,
    content: {
      title: "Our Services",
      description: "Everything you need for your diving adventure",
      columns: [
        {
          icon: "Waves",
          heading: "Scuba Diving",
          body: "Professional scuba diving courses for all skill levels"
        },
        {
          icon: "Ship",
          heading: "Boat Tours",
          body: "Explore the ocean with our guided boat tours"
        },
        {
          icon: "Camera",
          heading: "Underwater Photography",
          body: "Capture your underwater memories with our photography services"
        }
      ],
      columnsPerRow: 3,
      alignment: "center",
      showIcons: true
    },
    order: 2,
    updatedAt: new Date()
  },
  {
    id: "3",
    pageId: "1",
    type: BlockType.COURSES,
    content: {
      title: "Diving Courses",
      description: "Professional certification courses for all levels",
      courses: [
        {
          title: "Open Water Diver",
          description: "Learn the basics of scuba diving",
          duration: "3-4 days",
          level: "beginner",
          price: 299,
          currency: "USD",
          maxDepth: 18,
          maxStudents: 4,
          includes: [
            "Equipment rental",
            "Certification card",
            "Training materials"
          ],
          image: "https://picsum.photos/400/200?random=1"
        },
        {
          title: "Advanced Open Water",
          description: "Expand your diving skills and experience",
          duration: "2-3 days",
          level: "intermediate",
          price: 199,
          currency: "USD",
          maxDepth: 30,
          maxStudents: 4,
          includes: ["Deep diving", "Navigation", "Specialty dives"],
          image: "https://picsum.photos/400/200?random=2"
        },
        {
          title: "Rescue Diver",
          description: "Learn to prevent and manage diving emergencies",
          duration: "3-4 days",
          level: "advanced",
          price: 399,
          currency: "USD",
          maxDepth: 40,
          maxStudents: 4,
          includes: ["Emergency training", "Rescue scenarios", "First aid"],
          image: "https://picsum.photos/400/200?random=3"
        }
      ],
      layout: "grid",
      columns: 3,
      showPricing: true,
      showLevels: true
    },
    order: 3,
    updatedAt: new Date()
  },
  {
    id: "4",
    pageId: "1",
    type: BlockType.MARINE_LIFE,
    content: {
      title: "Marine Life You'll See",
      description: "Discover the incredible underwater creatures",
      currentSeason: "summer",
      items: [
        {
          name: "Sea Turtles",
          description:
            "Gentle giants of the sea, often found in shallow waters",
          season: "year-round",
          image: "https://picsum.photos/300/200?random=4",
          depth: "5-20m",
          difficulty: "easy"
        },
        {
          name: "Tropical Fish",
          description: "Colorful reef fish in vibrant coral gardens",
          season: "year-round",
          image: "https://picsum.photos/300/200?random=5",
          depth: "3-15m",
          difficulty: "easy"
        },
        {
          name: "Manta Rays",
          description: "Majestic rays gliding through the water",
          season: "summer",
          image: "https://picsum.photos/300/200?random=6",
          depth: "10-30m",
          difficulty: "moderate"
        }
      ],
      layout: "grid",
      columns: 3,
      showSeasonalFilter: true
    },
    order: 4,
    updatedAt: new Date()
  },
  {
    id: "5",
    pageId: "1",
    type: BlockType.TESTIMONIALS,
    content: {
      title: "What Our Divers Say",
      description: "Don't just take our word for it",
      testimonials: [
        {
          name: "Sarah Johnson",
          role: "Open Water Diver",
          content:
            "Amazing experience! The instructors were professional and made me feel safe throughout the entire course.",
          rating: 5,
          photo: "https://picsum.photos/100/100?random=7"
        },
        {
          name: "Mike Chen",
          role: "Advanced Diver",
          content:
            "The advanced course exceeded my expectations. I learned so much and had incredible dives.",
          rating: 5,
          photo: "https://picsum.photos/100/100?random=8"
        },
        {
          name: "Emma Davis",
          role: "Rescue Diver",
          content:
            "The rescue course was challenging but rewarding. I feel much more confident as a diver now.",
          rating: 5,
          photo: "https://picsum.photos/100/100?random=9"
        }
      ],
      layout: "grid",
      columns: 3,
      showPhotos: true,
      showRatings: true
    },
    order: 5,
    updatedAt: new Date()
  },
  {
    id: "6",
    pageId: "1",
    type: BlockType.TEAM,
    content: {
      title: "Our Expert Team",
      description: "Meet our certified diving instructors",
      members: [
        {
          name: "Captain Alex",
          role: "Master Instructor",
          bio: "PADI Master Instructor with 15+ years of experience",
          photo: "https://picsum.photos/400/300?random=10",
          email: "alex@coralparadise.com",
          phone: "+1-555-0123"
        },
        {
          name: "Maria Santos",
          role: "Divemaster",
          bio: "Experienced divemaster specializing in reef conservation",
          photo: "https://picsum.photos/400/300?random=11",
          email: "maria@coralparadise.com",
          phone: "+1-555-0124"
        },
        {
          name: "David Kim",
          role: "Instructor",
          bio: "PADI Instructor with expertise in underwater photography",
          photo: "https://picsum.photos/400/300?random=12",
          email: "david@coralparadise.com",
          phone: "+1-555-0125"
        }
      ],
      layout: "grid",
      columns: 3,
      showContactInfo: true,
      showSocialLinks: false,
      fullWidthPhoto: true
    },
    order: 6,
    updatedAt: new Date()
  },
  {
    id: "7",
    pageId: "1",
    type: BlockType.FAQ,
    content: {
      title: "Frequently Asked Questions",
      description: "Everything you need to know about diving with us",
      items: [
        {
          question: "Do I need to know how to swim?",
          answer:
            "Yes, you should be comfortable in the water and able to swim at least 200 meters."
        },
        {
          question: "What equipment do I need?",
          answer:
            "We provide all necessary equipment including wetsuits, BCDs, regulators, and tanks."
        },
        {
          question: "How long does certification take?",
          answer:
            "Open Water certification typically takes 3-4 days, including classroom, pool, and open water dives."
        },
        {
          question: "Is diving safe?",
          answer:
            "Yes, when done with proper training and following safety protocols. Our instructors are certified and experienced."
        }
      ],
      layout: "accordion",
      allowMultipleOpen: false
    },
    order: 7,
    updatedAt: new Date()
  },
  {
    id: "8",
    pageId: "1",
    type: BlockType.CONTACT_FORM,
    content: {
      title: "Get in Touch",
      description: "Ready to start your diving adventure? Contact us!",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Full Name",
          required: true,
          placeholder: "Enter your full name"
        },
        {
          name: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "Enter your email"
        },
        {
          name: "phone",
          type: "tel",
          label: "Phone Number",
          required: false,
          placeholder: "Enter your phone number"
        },
        {
          name: "course",
          type: "select",
          label: "Interested Course",
          required: true,
          options: [
            "Open Water Diver",
            "Advanced Open Water",
            "Rescue Diver",
            "Other"
          ]
        },
        {
          name: "message",
          type: "textarea",
          label: "Message",
          required: false,
          placeholder: "Tell us about your diving goals"
        }
      ],
      submitButtonText: "Send Message",
      successMessage: "Thank you! We'll get back to you soon.",
      emailTo: "info@coralparadise.com"
    },
    order: 8,
    updatedAt: new Date()
  },
  {
    id: "9",
    pageId: "1",
    type: BlockType.CALL_TO_ACTION,
    content: {
      title: "Ready to Dive?",
      description:
        "Book your diving adventure today and explore the underwater world",
      primaryButton: {
        label: "Book Your Course",
        url: "/booking",
        variant: "secondary"
      },
      secondaryButton: {
        label: "Contact Us",
        url: "/contact",
        variant: "outline"
      },
      backgroundImage: "https://picsum.photos/1200/400?random=3",
      alignment: "center",
      backgroundColor: "#f8fafc",
      textColor: "#ffffff"
    },
    order: 10,
    updatedAt: new Date()
  },
  {
    id: "10",
    pageId: "1",
    type: BlockType.GALLERY,
    content: {
      title: "Underwater Gallery",
      description: "Explore our stunning underwater photography",
      images: [
        {
          src: "https://picsum.photos/400/300?random=14",
          alt: "Coral reef",
          caption: "Vibrant coral reef ecosystem"
        },
        {
          src: "https://picsum.photos/400/300?random=15",
          alt: "Sea turtle",
          caption: "Gentle sea turtle swimming"
        },
        {
          src: "https://picsum.photos/400/300?random=16",
          alt: "Tropical fish",
          caption: "Colorful tropical fish"
        },
        {
          src: "https://picsum.photos/400/300?random=17",
          alt: "Diving equipment",
          caption: "Professional diving equipment"
        },
        {
          src: "https://picsum.photos/400/300?random=18",
          alt: "Underwater cave",
          caption: "Mysterious underwater cave"
        },
        {
          src: "https://picsum.photos/400/300?random=19",
          alt: "Manta ray",
          caption: "Majestic manta ray"
        }
      ],
      layout: "grid",
      columns: 3,
      showCaptions: true
    },
    order: 10,
    updatedAt: new Date()
  },
  {
    id: "11",
    pageId: "1",
    type: BlockType.VIDEO,
    content: {
      title: "Diving Experience",
      description: "Watch our diving adventures in action",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      autoplay: false,
      controls: true,
      width: 16,
      height: 9
    },
    order: 11,
    updatedAt: new Date()
  },
  {
    id: "12",
    pageId: "1",
    type: BlockType.MAP,
    content: {
      title: "Find Us",
      description: "Visit our dive center",
      address: "123 Ocean Drive, Coral Bay, CA 90210",
      latitude: 34.0522,
      longitude: -118.2437,
      zoom: 15,
      height: 400
    },
    order: 12,
    updatedAt: new Date()
  },
  {
    id: "13",
    pageId: "1",
    type: BlockType.SOCIAL_FEED,
    content: {
      title: "Follow Our Adventures",
      description: "See our latest diving photos and updates",
      platform: "instagram",
      username: "coralparadisediving",
      postCount: 6,
      showCaptions: true,
      layout: "grid",
      columns: 3
    },
    order: 13,
    updatedAt: new Date()
  },
  {
    id: "14",
    pageId: "1",
    type: BlockType.DIVIDER,
    content: {
      text: "Ready to start your journey?",
      alignment: "center",
      style: "solid",
      color: "#3b82f6",
      thickness: 2
    },
    order: 14,
    updatedAt: new Date()
  },
  {
    id: "15",
    pageId: "1",
    type: BlockType.TWO_COLUMN,
    content: {
      title: "Why Choose Us?",
      description: "Discover what makes us different",
      content: {
        leftContent: {
          type: "text",
          title: "Expert Instructors",
          content:
            "Our certified instructors have years of experience and are passionate about teaching safe diving practices. We maintain small class sizes to ensure personalized attention and maximum safety."
        },
        rightContent: {
          type: "image",
          content: "https://picsum.photos/600/400?random=20",
          title: "Professional Training"
        },
        layout: "text-image",
        alignment: "center",
        spacing: 8
      },
      background: "#f8fafc",
      padding: 16
    },
    order: 15,
    updatedAt: new Date()
  }
]

export default DiveShopSite
