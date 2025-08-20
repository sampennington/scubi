import { z } from "zod"
import { BlockType } from "@/database/schema"

export const SeoMetaSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  canonical: z.string().optional(),
  robots: z.string().optional(),
  og: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      type: z.string().optional(),
      url: z.string().optional()
    })
    .optional(),
  twitter: z
    .object({
      card: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional()
    })
    .optional(),
  jsonLd: z.array(z.unknown()).default([])
})
export type SeoMeta = z.infer<typeof SeoMetaSchema>

export const ColorPaletteSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  background: z.string().optional(),
  accent: z.string().optional(),
  palette: z.array(z.string()).default([])
})
export type ColorPalette = z.infer<typeof ColorPaletteSchema>

export const FontsSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional(),
  families: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([])
})
export type Fonts = z.infer<typeof FontsSchema>

export const ImageAssetSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  context: z.enum(["img", "background"]).default("img"),
  pageUrl: z.string()
})
export type ImageAsset = z.infer<typeof ImageAssetSchema>

export const SectionTypeSchema = z.enum([
  "nav",
  "hero",
  "about",
  "services",
  "courses",
  "gallery",
  "testimonials",
  "faq",
  "team",
  "contact",
  "map",
  "cta",
  "footer",
  "text",
  "image",
  "unknown"
])
export type SectionType = z.infer<typeof SectionTypeSchema>

export const PageSectionSchema = z.object({
  type: SectionTypeSchema,
  selector: z.string().optional(),
  heading: z.string().optional(),
  textSample: z.string().optional(),
  images: z.array(z.string()).default([])
})
export type PageSection = z.infer<typeof PageSectionSchema>

export const BlockCandidateSchema = z.object({
  type: z.nativeEnum(BlockType),
  content: z.unknown(),
  sourceSectionType: SectionTypeSchema.optional()
})
export type BlockCandidate = z.infer<typeof BlockCandidateSchema>

export const LlmBlockCandidateSchema = z.object({
  type: z.nativeEnum(BlockType),
  content: z.unknown(),
  sourceSectionType: SectionTypeSchema.optional(),
  confidence: z.number().min(0).max(1),
  rationale: z.string().optional()
})
export type LlmBlockCandidate = z.infer<typeof LlmBlockCandidateSchema>

export const RenderStatsSchema = z.object({
  screenshotPng: z.string().optional(),
  cssUrls: z.array(z.string()).default([]),
  computedFonts: z.object({
    h1: z.array(z.string()).default([]),
    h2: z.array(z.string()).default([]),
    body: z.array(z.string()).default([])
  }),
  dominantColors: z.array(z.string()).default([])
})

export const AiSignalsSchema = z.object({
  llmBlocks: z.array(LlmBlockCandidateSchema).default([]),
  notes: z.string().optional(),
  confidence: z.number().min(0).max(1).optional()
})

export type SiteMapNode = {
  url: string
  title?: string
  children: SiteMapNode[]
}

export const SiteMapNodeSchema: z.ZodType<SiteMapNode> = z.lazy(() =>
  z.object({
    url: z.string(),
    title: z.string().optional(),
    children: z.array(SiteMapNodeSchema).default([])
  })
)

export const ScrapedPageSchema = z.object({
  url: z.string(),
  slug: z.string(),
  title: z.string().optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  sections: z.array(PageSectionSchema).default([]),
  blockCandidates: z.array(BlockCandidateSchema).default([]),
  images: z.array(ImageAssetSchema).default([]),
  seo: SeoMetaSchema,
  render: RenderStatsSchema.optional(),
  ai: AiSignalsSchema.optional()
})

export type ScrapedPage = z.infer<typeof ScrapedPageSchema>

export const SiteScrapeSchema = z.object({
  targetUrl: z.string(),
  crawledAt: z.date(),
  colors: ColorPaletteSchema,
  fonts: FontsSchema,
  sitemap: z.array(SiteMapNodeSchema).default([]),
  pages: z.array(ScrapedPageSchema),
  rawCssUrls: z.array(z.string()).default([]),
  robotsTxt: z.string().optional(),
  sitemapXmlUrls: z.array(z.string()).default([]),
  errors: z.array(z.string()).default([]),
  renderCssSample: z.array(z.string()).default([])
})

export type SiteScrape = z.infer<typeof SiteScrapeSchema>


