import type { VideoContent } from "@/app/dashboard/shops/[id]/components/BlockForm/schemas"

const defaultContent: VideoContent = {
  title: "Set your video title here",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  provider: "youtube"
}

const getVideoEmbedUrl = (
  url: string,
  provider: string,
  autoplay: boolean = false
) => {
  if (provider === "youtube") {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    )?.[1]
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`
    }
  }

  if (provider === "vimeo") {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}`
    }
  }

  return url
}

export const VideoBlock = ({
  content = defaultContent
}: {
  content?: VideoContent
}) => {
  const {
    title,
    description,
    videoUrl,
    provider,
    autoplay = false,
    controls = true,
    width = 16,
    height = 9
  } = content

  const embedUrl = getVideoEmbedUrl(videoUrl, provider, autoplay)
  const aspectRatio = `${width}/${height}`

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="mx-auto max-w-4xl">
          <div className="relative w-full" style={{ aspectRatio }}>
            {provider === "custom" ? (
              <video
                src={videoUrl}
                controls={controls}
                autoPlay={autoplay}
                className="h-full w-full rounded-lg"
              >
                <track kind="captions" />
              </video>
            ) : (
              <iframe
                src={embedUrl}
                title={title || "Video"}
                className="h-full w-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
