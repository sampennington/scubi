## Scraper

This scraper converts an existing website into a normalized `SiteScrape` object that can be mapped into pages and blocks in the app.

### How it works
1. Discover URLs via `robots.txt`/`sitemap.xml` (fallback: shallow crawl).
2. Render each page with a pluggable render engine (Playwright by default).
3. Parse the rendered HTML with Cheerio-based utilities to extract SEO, text, sections, images, and CSS links.
4. Fetch page CSS and infer colors/fonts.
5. Optionally call OpenAI to propose additional block candidates and validate them against block Zod schemas.
6. Assemble a `SiteScrape` object and write unmapped leftovers to `tmp/scrapes/*.json` for manual review.

### Architecture
- `index.ts`: Orchestrator (discovery → render → extract → assemble result).
- `models.ts`: Zod schemas and TS types for all outputs.
- `engines/`:
  - `types.ts`: Renderer interface.
  - `playwright-renderer.ts`: Playwright implementation (headless, resource blocking, HTML + CSS URLs + screenshot).
- `utils/`:
  - `http.ts`: URL helpers and HTTP fetch.
  - `robots.ts`: robots.txt loader and allow checks.
  - `sitemap.ts`: sitemap discovery and XML parsing.
  - `html.ts`: SEO meta, text, image, selector helpers.
  - `sections.ts`: heuristic section inference (nav/hero/gallery/etc.).
  - `css.ts`: stylesheet discovery, color scoring, font extraction.
  - `mapper.ts`: section → block candidate mapping.
  - `files.ts`: write leftovers JSON to disk.
  - `ai.ts`: OpenAI JSON extraction for complex block proposals (validated via Zod).

### Pluggable renderer
Define a renderer by implementing the interface:

```ts
// engines/types.ts
export type RenderedPage = { html: string; cssUrls: string[]; screenshotPng?: string }
export interface Renderer {
  render(url: string): Promise<RenderedPage>
  close(): Promise<void>
}
```

The default engine is `PlaywrightRenderer` (`engines/playwright-renderer.ts`). To swap engines, create another class implementing `Renderer` and instantiate it in `index.ts`.

### Data model (key types)
- `SiteScrape` (overall result):
  - `targetUrl`, `crawledAt`, `colors`, `fonts`, `sitemap: SiteMapNode[]`, `pages: ScrapedPage[]`, `robotsTxt`, `sitemapXmlUrls`, `errors`.
- `ScrapedPage`:
  - `url`, `slug`, `title`, `html`, `text`, `sections`, `blockCandidates`, `images`, `seo`.

See `models.ts` for full detail and Zod validation.

### Running locally
1. Install deps (npm):
```bash
npm i cheerio robots-parser fast-xml-parser
npm i -D playwright tsx
npx playwright install --with-deps
```
2. Env: set `OPENAI_API_KEY` in `.env.local` (optional if you want LLM block proposals).
3. Run:
```bash
npx tsx src/scraper/index.ts https://example.com
```

### Output
- Prints the `SiteScrape` JSON to stdout.
- Writes leftovers for manual review to `tmp/scrapes/<host>-<timestamp>.json` containing sections, images, SEO, and any candidates that failed schema validation.

### Deployment notes
- Playwright runs headless on Node servers/containers. For CI/Docker, install browser deps or use a Playwright base image. Consider running the scraper as a background job (long-running).


