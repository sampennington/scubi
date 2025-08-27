import type { VideoContent } from "../../shared/schemas"

export const defaultVideoContent: VideoContent = {
  title: "Watch Our Video",
  description: "See what we're all about",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  provider: "youtube",
  autoplay: false,
  controls: true
}
