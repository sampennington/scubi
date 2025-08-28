import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  unique,
  primaryKey
} from "drizzle-orm/pg-core"

export const BlockType = {
  HERO: "hero",
  TEXT: "text",
  IMAGE: "image",
  MULTI_COLUMN: "multi-column",
  GALLERY: "gallery",
  TESTIMONIALS: "testimonials",
  TEAM: "team",
  FAQ: "faq",
  CONTACT_FORM: "contact-form",
  CALL_TO_ACTION: "call-to-action",
  VIDEO: "video",
  MAP: "map",
  SOCIAL_FEED: "social-feed",
  DIVIDER: "divider",
  TWO_COLUMN: "two-column",
  COURSES: "courses",
  MARINE_LIFE: "marine-life",
  DIVE_SITES: "dive-sites",
  REVIEWS: "reviews",
  CONTENT_STICKY: "content-sticky",
  STATS: "stats"
} as const

export const BlockTypeDescriptions: Record<BlockType, string> = {
  [BlockType.HERO]:
    "A full‑width section typically at the top of the page, featuring a prominent background image or video with overlaid headline, supporting copy, and primary/secondary CTAs.",
  [BlockType.TEXT]:
    "A flexible rich‑text section for headings and paragraphs; ideal for introductions, explanations, or standalone copy.",
  [BlockType.IMAGE]:
    "A single media block to showcase an image with optional caption/alt and responsive sizing.",
  [BlockType.MULTI_COLUMN]:
    "A layout section that arranges content into multiple columns for scannability; columns can contain text, icons, or small images.",
  [BlockType.GALLERY]:
    "A grid or carousel of images for showcasing photos; may support captions and lightbox/open‑in‑place behavior.",
  [BlockType.TESTIMONIALS]:
    "Displays customer quotes and ratings, often with names, avatars, and optional company logos.",
  [BlockType.TEAM]:
    "Introduces team members or instructors with photos, names, roles, and potentially brief bios or links.",
  [BlockType.FAQ]:
    "An accordion of common questions and answers to address user concerns and reduce support friction.",
  [BlockType.CONTACT_FORM]:
    "A lead‑capture form (e.g., name, email, message) for enquiries; can include phone/subject and routes submissions to a configured endpoint.",
  [BlockType.CALL_TO_ACTION]:
    "A focused prompt driving a specific action (book, enquire, subscribe) with concise copy and one or two CTAs.",
  [BlockType.VIDEO]:
    "Embeds video from a URL or file with optional title/description and poster image.",
  [BlockType.MAP]:
    "Shows a map centered on the business location with a pin and optional address details or directions link.",
  [BlockType.SOCIAL_FEED]:
    "Surfaces recent posts from a social platform (e.g., Instagram) with thumbnails and links back to the source.",
  [BlockType.DIVIDER]:
    "A visual separator—line, space, or decorative element—to break up content sections.",
  [BlockType.TWO_COLUMN]:
    "A balanced two‑column layout, commonly pairing text and media (e.g., copy left, image right) with responsive stacking.",
  [BlockType.COURSES]:
    "Showcases courses or offerings with title, description, key details (level, duration, price), and links to learn more or enroll.",
  [BlockType.MARINE_LIFE]:
    "Highlights marine species or dive‑site points of interest with images and short descriptions—tailored for dive content.",
  [BlockType.DIVE_SITES]:
    "Lists dive sites with depth, difficulty, conditions, and summaries; can link to detailed pages for each site.",
  [BlockType.REVIEWS]:
    "Aggregates third‑party reviews (e.g., Google, TripAdvisor) with ratings and excerpts, optionally linking to sources.",
  [BlockType.CONTENT_STICKY]:
    "A content section with sticky image layout featuring text, features list, and background graphics for showcasing workflows or processes.",
  [BlockType.STATS]:
    "Display impressive statistics and key metrics in a grid layout with customizable values, labels, and styling options."
}

export type BlockType = (typeof BlockType)[keyof typeof BlockType]

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  avatar: text("avatar"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  stripeCustomerId: text("stripe_customer_id")
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
})

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
})

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date())
})

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  plan: text("plan").notNull(),
  referenceId: text("reference_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").default("incomplete"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  seats: integer("seats"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end")
})

export const shops = pgTable("shops", {
  id: text("id").primaryKey(), // UUID or ULID
  name: text("name").notNull(), // "Blue Divers"
  slug: text("slug").notNull().unique(), // for URLs: blue-divers
  customDomain: text("custom_domain"), // e.g. bluedivers.com
  templateId: text("template_id"),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null"
  }),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export const shopMembers = pgTable(
  "shop_members",
  {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    shopId: text("shop_id")
      .references(() => shops.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").default("editor") // 'admin', 'editor', 'viewer'
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.shopId] })
  })
)

export const pages = pgTable(
  "pages",
  {
    id: text("id").primaryKey(),
    shopId: text("shop_id")
      .references(() => shops.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(), // e.g. "/", "/about"
    parentId: text("parent_id"),
    order: integer("order").default(0),
    showInNav: boolean("show_in_nav").default(true),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (pages) => ({
    uniqueSlugPerShop: unique().on(pages.shopId, pages.slug)
  })
)

export const blocks = pgTable("blocks", {
  id: text("id").primaryKey(),
  pageId: text("page_id")
    .references(() => pages.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // 'hero', 'text', 'image', 'multi-column'
  content: jsonb("content").notNull(), // block content
  order: integer("order").default(0),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  previewUrl: text("preview_url"),
  settings: jsonb("settings") // { font: "Poppins", colors: { ... } }
})

export const siteSettings = pgTable("site_settings", {
  shopId: text("shop_id")
    .primaryKey()
    .references(() => shops.id),
  name: text("name").notNull(),
  homePageId: text("home_page_id").references(() => pages.id),
  faviconUrl: text("favicon_url"),
  logoUrl: text("logo_url"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  whatsappUrl: text("whatsapp_url"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  address: text("address"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  fontFamilyHeading: text("font_family_heading"),
  fontFamilyBody: text("font_family_body")
})

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  shopId: text("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .notNull(),
  platform: text("platform").notNull(), // 'google', 'tripadvisor', 'facebook', etc.
  externalId: text("external_id"), // ID from the platform
  reviewerName: text("reviewer_name").notNull(),
  reviewerPhoto: text("reviewer_photo"), // URL to profile photo
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text").notNull(),
  reviewDate: timestamp("review_date").notNull(),
  language: text("language").default("en"),
  verified: boolean("verified").default(false),
  helpfulCount: integer("helpful_count").default(0),
  reviewUrl: text("review_url"), // Link to the review on the platform
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull()
})
