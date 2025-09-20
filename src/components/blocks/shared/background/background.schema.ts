import { z } from "zod"

export const BackgroundTypeEnum = z.enum([
  "none",
  "color", 
  "gradient",
  "image"
])

export const BackgroundColorSchema = z.object({
  type: z.literal("color"),
  color: z.string()
})

export const BackgroundGradientSchema = z.object({
  type: z.literal("gradient"),
  direction: z.enum([
    "to-r", // left to right
    "to-l", // right to left  
    "to-t", // bottom to top
    "to-b", // top to bottom
    "to-tr", // bottom-left to top-right
    "to-tl", // bottom-right to top-left
    "to-br", // top-left to bottom-right
    "to-bl" // top-right to bottom-left
  ]),
  fromColor: z.string(),
  toColor: z.string()
})

export const BackgroundImageSchema = z.object({
  type: z.literal("image"),
  url: z.string(),
  position: z.enum([
    "center",
    "top",
    "bottom", 
    "left",
    "right",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ]),
  size: z.enum([
    "cover",
    "contain", 
    "auto"
  ]),
  repeat: z.enum([
    "no-repeat",
    "repeat",
    "repeat-x",
    "repeat-y"
  ]),
  overlay: z.object({
    enabled: z.boolean(),
    color: z.string()
  }).optional()
})

export const BackgroundNoneSchema = z.object({
  type: z.literal("none")
})

export const BackgroundConfigSchema = z.discriminatedUnion("type", [
  BackgroundNoneSchema,
  BackgroundColorSchema,
  BackgroundGradientSchema,
  BackgroundImageSchema
])

export type BackgroundType = z.infer<typeof BackgroundTypeEnum>
export type BackgroundColor = z.infer<typeof BackgroundColorSchema>
export type BackgroundGradient = z.infer<typeof BackgroundGradientSchema>
export type BackgroundImage = z.infer<typeof BackgroundImageSchema>
export type BackgroundNone = z.infer<typeof BackgroundNoneSchema>
export type BackgroundConfig = z.infer<typeof BackgroundConfigSchema>

export const defaultBackgroundConfig: BackgroundConfig = {
  type: "none"
}

export function isBackgroundConfig(data: unknown): data is BackgroundConfig {
  return BackgroundConfigSchema.safeParse(data).success
}