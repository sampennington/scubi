# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core development:**
- `npm run dev` - Start development server on scubi.local:3000 with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server

**Code quality:**
- `npm run lint` - Run Biome linter and formatter
- `npm run check-types` - TypeScript type checking without emit

**Database operations:**
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

**Authentication schema setup:**
- `npx @better-auth/cli generate` - Generate Better Auth database schema

**Scraper (standalone):**
- `npx tsx src/scraper/index.ts https://example.com` - Run website scraper

## Architecture Overview

### Core Tech Stack
- **Framework:** Next.js 15 with App Router and Turbopack
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth with Stripe integration
- **UI:** shadcn/ui components with TailwindCSS
- **Code Quality:** Biome for linting/formatting
- **Payments:** Stripe with subscription support
- **File Uploads:** UploadThing
- **Email:** Resend

### Project Structure

**Main Application (`src/`):**
- `app/` - Next.js App Router pages and API routes
  - `(marketing)/` - Landing pages
  - `dashboard/` - User dashboard with shops/billing/settings
  - `preview/[shopId]/` - Shop preview pages
  - `auth/[pathname]/` - Authentication pages
- `components/` - Reusable React components
  - `blocks/` - Content block components (hero, text, gallery, etc.)
  - `editable/` - Editable block variants
  - `ui/` - shadcn/ui components
- `lib/` - Business logic, API clients, utilities
- `database/` - Drizzle schema and connection
- `scraper/` - Standalone website scraper tool

**Website Scraper (`src/scraper/`):**
- Converts existing websites into normalized block structure
- Uses Playwright for rendering, Cheerio for parsing
- Optional OpenAI integration for intelligent block extraction
- Pluggable renderer architecture
- Outputs to `tmp/scrapes/` for review

### Key Data Models

**Shops & Pages:**
- `shops` - Multi-tenant dive shop websites
- `pages` - Individual pages within shops
- `blocks` - Content blocks within pages (hero, text, gallery, etc.)
- `siteSettings` - Shop-wide configuration (colors, fonts, logos)

**Block System:**
- 15+ block types (hero, text, multi-column, testimonials, etc.)
- Specialized dive industry blocks (marine-life, dive-sites, courses)
- JSON-based content storage with Zod validation
- Editable and preview variants

**Authentication & Billing:**
- Better Auth for session management
- Stripe integration with subscription plans
- Multi-role shop membership system
- Trial period support

### Development Configuration

**Local Development:**
- Uses custom domain: `scubi.local:3000`
- Cross-subdomain cookies configured for `.scubi.local`
- Environment variables in `.env.local`

**Code Style (Biome):**
- 2-space indentation, 100 character line width
- Semicolons as needed, no trailing commas
- Auto-fixes for unused imports, template literals
- **CRITICAL:** TailwindCSS classes MUST be sorted using the `useSortedClasses` Biome rule
- Use `cn()` function for conditional classes, ensuring all classes are properly sorted

### Code Quality Rules
- Do not leave comments like: "// Memoize visible sections to avoid re-renders" This should be obvious from the high quality self documenting code you write.
- Do not add obvious comments that simply restate what the code does (e.g., "// Validate the definition", "// Create the block config", "// Register with the global registry")
- Only add comments for complex business logic, non-obvious algorithms, or important architectural decisions
- Prefer self-documenting code with clear function/variable names over explanatory comments

**TailwindCSS Class Sorting:**
- All TailwindCSS classes MUST be sorted according to the `useSortedClasses` Biome rule
- This applies to all `className` attributes and `cn()` function calls
- Run `npm run lint` to automatically fix class ordering
- Example: `className="flex items-center justify-center gap-4 rounded-lg bg-blue-500 px-4 py-2 text-white"`

### Important Files
- `src/config/site.ts` - Site-wide configuration
- `src/lib/auth.ts` - Better Auth configuration
- `src/database/schema.ts` - Complete database schema
- `drizzle.config.ts` - Database connection config
- `biome.json` - Code formatting and linting rules