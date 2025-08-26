import Image from "next/image"
import type { SocialFeedContent } from "../../../shared/schemas"

const defaultContent: SocialFeedContent = {
  title: "Set your social feed title here",
  platform: "instagram",
  username: "yourusername"
}

export const SocialFeedBlock = ({ content = defaultContent }: { content?: SocialFeedContent }) => {
  const {
    title,
    description,
    platform,
    username,
    postCount = 6,
    showCaptions = true,
    layout = "grid",
    columns = 3
  } = content

  const gridCols = {
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  }

  const mockPosts = Array.from({ length: postCount }, (_, i) => ({
    id: i,
    image: `https://picsum.photos/300/300?random=${i}`,
    caption: `Sample ${platform} post ${i + 1}`,
    url: "#"
  }))

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        {layout === "grid" && (
          <div className={`grid gap-4 ${gridCols[columns]}`}>
            {mockPosts.map((post) => (
              <div key={post.id} className="group relative overflow-hidden rounded-lg">
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    width={300}
                    height={300}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {showCaptions && (
                    <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-3 text-white">
                      <p className="text-sm">{post.caption}</p>
                    </div>
                  )}
                </a>
              </div>
            ))}
          </div>
        )}

        {layout === "carousel" && (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="flex-shrink-0">
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    <div className="group relative overflow-hidden rounded-lg">
                      <Image
                        src={post.image}
                        alt={post.caption}
                        className="h-64 w-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {showCaptions && (
                        <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-3 text-white">
                          <p className="text-sm">{post.caption}</p>
                        </div>
                      )}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href={`https://${platform}.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Follow us on {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </a>
        </div>
      </div>
    </section>
  )
}
