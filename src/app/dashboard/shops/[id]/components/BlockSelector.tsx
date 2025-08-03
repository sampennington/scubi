"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BlockType } from "@/database/schema"
import {
  Type,
  Image,
  Columns,
  Images,
  MessageSquare,
  Users,
  HelpCircle,
  Mail,
  ArrowRight,
  Play,
  MapPin,
  Share2,
  Minus,
  Layout,
  BookOpen,
  Fish
} from "lucide-react"

interface BlockSelectorProps {
  onSelect: (blockType: string) => void
  onClose: () => void
}

const blockTypes = [
  {
    type: BlockType.HERO,
    label: "Hero Section",
    description: "Large banner with title, text, and buttons",
    icon: ArrowRight,
    color: "bg-blue-500"
  },
  {
    type: BlockType.TEXT,
    label: "Text Block",
    description: "Simple text content with alignment options",
    icon: Type,
    color: "bg-gray-500"
  },
  {
    type: BlockType.IMAGE,
    label: "Image",
    description: "Single image with caption",
    icon: Image,
    color: "bg-green-500"
  },
  {
    type: BlockType.MULTI_COLUMN,
    label: "Multi Column",
    description: "Content organized in columns with icons",
    icon: Columns,
    color: "bg-purple-500"
  },
  {
    type: BlockType.GALLERY,
    label: "Gallery",
    description: "Grid of images with captions",
    icon: Images,
    color: "bg-pink-500"
  },
  {
    type: BlockType.TESTIMONIALS,
    label: "Testimonials",
    description: "Customer reviews and ratings",
    icon: MessageSquare,
    color: "bg-yellow-500"
  },
  {
    type: BlockType.TEAM,
    label: "Team",
    description: "Team member profiles with photos",
    icon: Users,
    color: "bg-indigo-500"
  },
  {
    type: BlockType.FAQ,
    label: "FAQ",
    description: "Frequently asked questions",
    icon: HelpCircle,
    color: "bg-orange-500"
  },
  {
    type: BlockType.CONTACT_FORM,
    label: "Contact Form",
    description: "Customizable contact form",
    icon: Mail,
    color: "bg-teal-500"
  },
  {
    type: BlockType.CALL_TO_ACTION,
    label: "Call to Action",
    description: "Prominent action buttons",
    icon: ArrowRight,
    color: "bg-red-500"
  },
  {
    type: BlockType.VIDEO,
    label: "Video",
    description: "Embedded video content",
    icon: Play,
    color: "bg-violet-500"
  },
  {
    type: BlockType.MAP,
    label: "Map",
    description: "Interactive map with location",
    icon: MapPin,
    color: "bg-emerald-500"
  },
  {
    type: BlockType.SOCIAL_FEED,
    label: "Social Feed",
    description: "Social media content feed",
    icon: Share2,
    color: "bg-cyan-500"
  },
  {
    type: BlockType.DIVIDER,
    label: "Divider",
    description: "Visual separator line",
    icon: Minus,
    color: "bg-slate-500"
  },
  {
    type: BlockType.TWO_COLUMN,
    label: "Two Column",
    description: "Content split into two columns",
    icon: Layout,
    color: "bg-amber-500"
  },
  {
    type: BlockType.COURSES,
    label: "Courses",
    description: "Course listings with details",
    icon: BookOpen,
    color: "bg-lime-500"
  },
  {
    type: BlockType.MARINE_LIFE,
    label: "Marine Life",
    description: "Marine life information",
    icon: Fish,
    color: "bg-blue-600"
  }
]

export function BlockSelector({ onSelect, onClose }: BlockSelectorProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Block Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blockTypes.map((blockType) => {
            const IconComponent = blockType.icon
            return (
              <Card
                key={blockType.type}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => onSelect(blockType.type)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-lg p-2 ${blockType.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">
                        {blockType.label}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {blockType.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm">
                    {blockType.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
