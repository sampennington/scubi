# 🧩 Dive Shop CMS Architecture & Schema

This document outlines the data model and logic behind the CMS system for the Dive Shop SaaS platform. It is built using **Next.js**, **Drizzle ORM**, and **PostgreSQL**, with a fully custom CMS powered by flexible content blocks.

---

## 📐 Schema Overview

The system is **multi-tenant**, meaning each dive shop (called a `shop`) can have its own set of pages, content, and users. Here's a summary of the key tables.

### `users`

Stores user accounts. Users can own one or more shops.

```ts
id: string (primary key)
email: string
name: string
stripeCustomerId: string
...
```

---

### `shops`

Represents each dive shop website.

```ts
id: string (primary key)
name: string
slug: string (unique)         // e.g. blue-divers
customDomain: string | null   // optional e.g. bluedivers.com
templateId: string | null     // which visual template to use
createdBy: string (userId)
```

---

### `shop_members`

Maps users to shops with role-based access.

```ts
userId: string;
shopId: string;
role: "admin" | "editor" | "viewer";
```

---

### `pages`

Each shop has multiple pages, e.g. "/", "/about", "/pricing".

```ts
id: string (primary key)
shopId: string
slug: string         // e.g. "/", "/about"
title: string
metaTitle: string
metaDescription: string
createdAt: timestamp
updatedAt: timestamp
```

#### 🔐 Constraint

```ts
unique().on(shopId, slug);
```

Ensures that slugs are unique per shop.

---

### `blocks`

Each page has a list of blocks, rendered in sequence.

```ts
id: string (primary key)
pageId: string
type: string          // e.g. 'hero', 'text', 'gallery'
content: jsonb        // typed content depending on block type
order: number         // controls display order
```

---

### `templates`

Pre-designed site layouts that control branding/styling.

```ts
id: string (primary key)
name: string
previewUrl: string
settings: jsonb       // e.g. { font: "Poppins", colors: { ... } }
```

---

## 🧠 How It All Works

### 1. 🏪 Shops Own All Content

Each dive shop (`shops`) has:

- Its own pages (`pages`)
- A team of users (`shop_members`)
- A selected template (`templateId`)
- Optional custom domain (`customDomain`)

---

### 2. 🧭 Pages Represent Routes

Each page is identified by a `slug`, which maps to a URL:

| Route      | Example Page |
| ---------- | ------------ |
| `/`        | Home page    |
| `/about`   | About page   |
| `/contact` | Contact page |

When rendering a public site, the app:

- Resolves the shop from the request domain or subdomain
- Loads the page using `slug` + `shopId`
- Fetches blocks by `pageId`

---

### 3. 🔲 Blocks Are Modular Content

Each page is composed of a list of `blocks`. Each block has:

- A `type` (e.g. `"hero"`, `"gallery"`, `"features"`)
- A `content` JSON object specific to the block type
- An `order` to determine display sequence

Example block content:

```json
{
  "type": "hero",
  "content": {
    "headline": "Welcome to Blue Divers",
    "subheadline": "Explore the underwater world with us",
    "imageUrl": "/images/hero.jpg",
    "ctaText": "Book a dive",
    "ctaUrl": "/book"
  }
}
```

---

### 4. 🧱 Rendering Pages in Next.js

To render a page on the frontend:

```ts
const page = await db.query.pages.findFirst({
  where: (p, { eq }) => eq(p.slug, "/about") && eq(p.shopId, currentShopId),
});

const blocks = await db.query.blocks.findMany({
  where: (b, { eq }) => eq(b.pageId, page.id),
  orderBy: (b) => b.order,
});
```

Then pass to a renderer like:

```tsx
{
  blocks.map((block) => (
    <BlockRenderer key={block.id} type={block.type} content={block.content} />
  ));
}
```

---

### 5. 🖼️ Previewing CMS Changes

You can build preview functionality using:

- **Option 1: Next.js Preview Mode**

  - Activate draft view using `/api/preview`
  - Render unpublished content for the current session

---

## ✅ Example Block Types to Implement

| Block Type | Fields (in content)                              |
| ---------- | ------------------------------------------------ |
| hero       | `headline`, `subheadline`, `imageUrl`, `ctaText` |
| text       | `richText` or `markdown`                         |
| gallery    | `images[]`, `captions[]`                         |
| features   | `title`, `features[]` (with icon, text)          |
| faq        | `questions[]` with `question` + `answer`         |
| cta        | `headline`, `buttonText`, `buttonUrl`            |

---

## 🧱 Folder Structure (Suggestion)

```
/app
  /[shopSlug]/[...pageSlug]/page.tsx   ← Public site rendering
  /dashboard/shops/[shopId]/pages      ← CMS admin for that shop
  /api/preview                         ← Optional Next.js preview API

/components
  /blocks
    BlockRenderer.tsx
    HeroBlock.tsx
    TextBlock.tsx
    ...
```

---

## 🧼 Admin Features to Build

- [ ] Create/edit `pages` per shop
- [ ] Add, update, delete, reorder `blocks`
- [ ] Select a `template` with preview
- [ ] (Optional) Live preview via iframe or block renderer
- [ ] Restrict access using `shop_members` roles

---

## 🧭 Summary

This schema gives you:

- ✅ Full control over content layout
- ✅ Multi-user + multi-shop setup
- ✅ Easy page rendering using blocks
- ✅ Flexible and composable content model

---
