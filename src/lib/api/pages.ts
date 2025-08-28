import { db } from "@/database/db"
import { eq, and, asc } from "drizzle-orm"
import { pages } from "@/database/schema"
import { generateId } from "@/lib/utils"
import { notFound } from "next/navigation"

export type Page = typeof pages.$inferSelect

export type NavigationItem = Page & {
  children: NavigationItem[]
}

export const pageApi = {
  async getById(id: string): Promise<Page | null> {
    try {
      const [page] = await db.select().from(pages).where(eq(pages.id, id))
      return page || null
    } catch (error) {
      console.error('Failed to fetch page by ID:', error)
      throw new Error('Failed to load page')
    }
  },

  async getBySlug(shopId: string, slug: string): Promise<Page | null> {
    try {
      const [page] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.shopId, shopId), eq(pages.slug, slug)))

      if (!page) {
        notFound()
      }

      return page
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_NOT_FOUND') {
        throw error // Re-throw notFound() errors
      }
      console.error('Failed to fetch page by slug:', error)
      throw new Error('Failed to load page')
    }
  },

  async getByShopId(shopId: string): Promise<Page[]> {
    try {
      return await db.select().from(pages).where(eq(pages.shopId, shopId)).orderBy(asc(pages.slug))
    } catch (error) {
      console.error('Failed to fetch pages by shop ID:', error)
      throw new Error('Failed to load pages')
    }
  },

  async getNavigationTree(shopId: string): Promise<NavigationItem[]> {
    try {
      const allPages = await db
        .select()
        .from(pages)
        .where(and(eq(pages.shopId, shopId), eq(pages.showInNav, true)))
        .orderBy(asc(pages.order), asc(pages.title))

      const buildTree = (parentId: string | null): NavigationItem[] => {
        return allPages
          .filter((page) => page.parentId === parentId)
          .map((page) => ({
            ...page,
            children: buildTree(page.id)
          }))
      }

      return buildTree(null)
    } catch (error) {
      console.error('Failed to fetch navigation tree:', error)
      throw new Error('Failed to load navigation')
    }
  },

  async getVisiblePages(shopId: string): Promise<Page[]> {
    try {
      return await db
        .select()
        .from(pages)
        .where(and(eq(pages.shopId, shopId), eq(pages.showInNav, true)))
        .orderBy(asc(pages.order), asc(pages.title))
    } catch (error) {
      console.error('Failed to fetch visible pages:', error)
      throw new Error('Failed to load visible pages')
    }
  },

  async create(data: {
    shopId: string
    title: string
    slug: string
    parentId?: string
    order?: number
    showInNav?: boolean
    metaTitle?: string
    metaDescription?: string
  }): Promise<Page> {
    try {
      const [page] = await db
        .insert(pages)
        .values({
          id: generateId(),
          order: data.order ?? 0,
          showInNav: data.showInNav ?? true,
          ...data
        })
        .returning()
      return page
    } catch (error) {
      console.error('Failed to create page:', error)
      throw new Error('Failed to create page')
    }
  },

  async update(id: string, data: Partial<Page>): Promise<Page | null> {
    try {
      const [page] = await db.update(pages).set(data).where(eq(pages.id, id)).returning()
      return page || null
    } catch (error) {
      console.error('Failed to update page:', error)
      throw new Error('Failed to update page')
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.delete(pages).where(eq(pages.id, id))
      return (result.rowCount ?? 0) > 0
    } catch (error) {
      console.error('Failed to delete page:', error)
      throw new Error('Failed to delete page')
    }
  },

  async createExamplePages(shopId: string): Promise<void> {
    try {
      await this.create({
        shopId,
        title: "Home",
        slug: "/",
        order: 1
      })

      await this.create({
        shopId,
        title: "About",
        slug: "/about",
        order: 2
      })

      const coursesPage = await this.create({
        shopId,
        title: "Courses",
        slug: "/courses",
        order: 3
      })

      await this.create({
        shopId,
        title: "Contact",
        slug: "/contact",
        order: 4
      })

      await this.create({
        shopId,
        title: "Open Water Course",
        slug: "/courses/open-water",
        parentId: coursesPage.id,
        order: 1
      })

      await this.create({
        shopId,
        title: "Advanced Course",
        slug: "/courses/advanced",
        parentId: coursesPage.id,
        order: 2
      })

      await this.create({
        shopId,
        title: "Rescue Course",
        slug: "/courses/rescue",
        parentId: coursesPage.id,
        order: 3
      })
    } catch (error) {
      console.error('Failed to create example pages:', error)
      throw new Error('Failed to create example pages')
    }
  }
}
