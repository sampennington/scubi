"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import * as Icons from "lucide-react"

// Common Lucide icons that are likely to be useful for multi-column layouts
const ICONS = {
  // Business & Services
  briefcase: Icons.Briefcase,
  building: Icons.Building,
  "chart-line": Icons.TrendingUp,
  users: Icons.Users,
  "user-check": Icons.UserCheck,
  award: Icons.Award,
  star: Icons.Star,
  heart: Icons.Heart,
  "thumbs-up": Icons.ThumbsUp,

  // Technology
  laptop: Icons.Laptop,
  smartphone: Icons.Smartphone,
  wifi: Icons.Wifi,
  shield: Icons.Shield,
  lock: Icons.Lock,
  key: Icons.Key,
  gear: Icons.Settings,
  code: Icons.Code,

  // Communication
  "message-circle": Icons.MessageCircle,
  phone: Icons.Phone,
  mail: Icons.Mail,
  send: Icons.Send,
  share: Icons.Share,
  link: Icons.Link,

  // Actions & Navigation
  "arrow-right": Icons.ArrowRight,
  "arrow-up": Icons.ArrowUp,
  check: Icons.Check,
  plus: Icons.Plus,
  minus: Icons.Minus,
  x: Icons.X,
  search: Icons.Search,
  filter: Icons.Filter,

  // Nature & Environment
  leaf: Icons.Leaf,
  tree: Icons.Trees,
  sun: Icons.Sun,
  moon: Icons.Moon,
  cloud: Icons.Cloud,
  rain: Icons.CloudRain,
  snow: Icons.CloudSnow,

  // Travel & Location
  "map-pin": Icons.MapPin,
  globe: Icons.Globe,
  compass: Icons.Compass,
  plane: Icons.Plane,
  car: Icons.Car,
  bike: Icons.Bike,

  // Time & Calendar
  clock: Icons.Clock,
  calendar: Icons.Calendar,
  timer: Icons.Timer,
  hourglass: Icons.Hourglass,

  // Money & Finance
  "dollar-sign": Icons.DollarSign,
  "credit-card": Icons.CreditCard,
  "piggy-bank": Icons.PiggyBank,
  "trending-up": Icons.TrendingUp,
  "trending-down": Icons.TrendingDown,

  // Education & Learning
  book: Icons.Book,
  "graduation-cap": Icons.GraduationCap,
  lightbulb: Icons.Lightbulb,
  brain: Icons.Brain,
  pencil: Icons.Pencil,

  // Health & Wellness
  "heart-pulse": Icons.Heart,
  activity: Icons.Activity,
  target: Icons.Target,
  zap: Icons.Zap,
  battery: Icons.Battery,

  // Food & Dining
  utensils: Icons.Utensils,
  coffee: Icons.Coffee,
  wine: Icons.Wine,
  pizza: Icons.Pizza,
  hamburger: Icons.Hamburger,

  // Entertainment
  music: Icons.Music,
  video: Icons.Video,
  camera: Icons.Camera,
  gamepad: Icons.Gamepad2,
  trophy: Icons.Trophy,

  // Tools & Equipment
  wrench: Icons.Wrench,
  hammer: Icons.Hammer,
  ruler: Icons.Ruler,
  scissors: Icons.Scissors,

  // Safety & Security
  "alert-triangle": Icons.AlertTriangle,
  info: Icons.Info,
  "help-circle": Icons.HelpCircle,
  "check-circle": Icons.CheckCircle,
  "x-circle": Icons.XCircle
} as const

type IconName = keyof typeof ICONS

interface IconSelectorProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function IconSelector({
  value,
  onChange,
  placeholder = "Select an icon...",
  className
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filteredIcons = Object.entries(ICONS).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const SelectedIcon = value ? ICONS[value as IconName] : null

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Icon</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-2">
              {SelectedIcon ? (
                <>
                  <SelectedIcon className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">{value}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="grid grid-cols-8 gap-1 p-2">
              {filteredIcons.map(([name, IconComponent]) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="sm"
                  className="h-12 w-12 p-0 hover:bg-muted"
                  onClick={() => {
                    onChange(name)
                    setIsOpen(false)
                    setSearchTerm("")
                  }}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </ScrollArea>
          {SelectedIcon && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-destructive hover:text-destructive"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Icon
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
