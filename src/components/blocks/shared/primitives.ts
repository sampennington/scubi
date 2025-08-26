import z from "zod"

export const BlockButtonSchema = z.object({
  label: z.string(),
  url: z.string(),
  variant: z.enum([
    "default",
    "cta",
    "secondary",
    "primary",
    "outline",
    "invert",
    "destructive",
    "ghost"
  ])
})
