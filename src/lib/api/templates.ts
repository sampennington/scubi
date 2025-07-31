import { db } from "@/database/db"
import { eq, asc } from "drizzle-orm"
import { templates } from "@/database/schema"

export const templateApi = {
  async getAll() {
    return db.select().from(templates).orderBy(asc(templates.name))
  },

  async getById(id: string) {
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id))
    return template || null
  }
}
