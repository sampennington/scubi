import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  unique
} from "drizzle-orm/pg-core"

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
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  )
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

export const shopMembers = pgTable("shop_members", {
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  shopId: text("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .notNull(),
  role: text("role").default("editor") // 'admin', 'editor', 'viewer'
})

export const pages = pgTable(
  "pages",
  {
    id: text("id").primaryKey(),
    shopId: text("shop_id")
      .references(() => shops.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(), // e.g. "/", "/about"
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
  type: text("type").notNull(), // e.g. 'hero', 'text', 'gallery'
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
  homePageId: text("home_page_id").references(() => pages.id),
  faviconUrl: text("favicon_url"),
  logoUrl: text("logo_url"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description")
})
