export const DEVICE_PRESETS = [
  { id: "mobile", label: "Mobile", w: 390, h: 844 },
  { id: "tablet", label: "Tablet", w: 768, h: 1024 },
  { id: "desktop", label: "Desktop", w: 1280, h: 800 }
] as const

export type DeviceId = (typeof DEVICE_PRESETS)[number]["id"]
