import { db } from "@/database/db"
import { eq, and, asc } from "drizzle-orm"
import { pages } from "@/database/schema"
import { generateId } from "@/lib/utils"

export type Page = typeof pages.$inferSelect

export type NavigationItem = Page & {
  children: NavigationItem[]
}

export const pageApi = {
  async getById(id: string): Promise<Page | null> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id))
    return page || null
  },

  async getBySlug(shopId: string, slug: string): Promise<Page | null> {
    const [page] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.shopId, shopId), eq(pages.slug, slug)))

    return page || null
  },

  async getByShopId(shopId: string): Promise<Page[]> {
    return db
      .select()
      .from(pages)
      .where(eq(pages.shopId, shopId))
      .orderBy(asc(pages.slug))
  },

  async getNavigationTree(shopId: string): Promise<NavigationItem[]> {
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
  },

  async getVisiblePages(shopId: string): Promise<Page[]> {
    return db
      .select()
      .from(pages)
      .where(and(eq(pages.shopId, shopId), eq(pages.showInNav, true)))
      .orderBy(asc(pages.order), asc(pages.title))
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
  },

  async update(id: string, data: Partial<Page>): Promise<Page | null> {
    const [page] = await db
      .update(pages)
      .set(data)
      .where(eq(pages.id, id))
      .returning()

    return page || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id))
    return (result.rowCount ?? 0) > 0
  },

  async createExamplePages(shopId: string): Promise<void> {
    const homePage = await this.create({
      shopId,
      title: "Home",
      slug: "/",
      order: 1
    })

    const aboutPage = await this.create({
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

    const contactPage = await this.create({
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
  }
}
