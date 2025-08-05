import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function getPreviewUrl(shopId: string): string {
  const isDevelopment = process.env.NODE_ENV === "development"
  const domain = process.env.NEXT_PUBLIC_APP_URL?.replace("http://", "")

  const protocol = isDevelopment ? "http" : "https"

  return `${protocol}://${shopId}.${domain}`
}
