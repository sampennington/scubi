import { drizzle } from "drizzle-orm/node-postgres"

console.log({ DATABASE_URL: process.env.DATABASE_URL })
export const db = drizzle(process.env.DATABASE_URL!)
