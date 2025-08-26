import type { MultiColumnContent } from "../../shared/schemas"
import { defaultMultiColumnContent } from "./defaults"
import * as Icons from "lucide-react"

// Icon mapping for Lucide React icons
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
  walk: Icons.User,

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

const getIcon = (iconName: string) => {
  const IconComponent = ICONS[iconName as keyof typeof ICONS]
  return IconComponent || null
}

export const MultiColumnBlock = ({
  content = defaultMultiColumnContent
}: {
  content?: MultiColumnContent
}) => {
  const {
    title,
    description,
    columns,
    columnsPerRow = 3,
    alignment = "center",
    showIcons = true
  } = content

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  const textAlignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className={`mb-12 ${textAlignment[alignment]}`}>
            {title && <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        <div className={`grid gap-8 ${gridCols[columnsPerRow]}`}>
          {columns.map((column, index) => (
            <div key={index} className={`flex flex-col ${textAlignment[alignment]}`}>
              {showIcons && column.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {(() => {
                      const IconComponent = getIcon(column.icon)
                      return IconComponent ? (
                        <IconComponent className="h-8 w-8 text-primary" />
                      ) : null
                    })()}
                  </div>
                </div>
              )}

              {column.heading && <h3 className="mb-3 font-semibold text-xl">{column.heading}</h3>}

              <p className="text-muted-foreground">{column.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
