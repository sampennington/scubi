import type { GalleryContent } from "../../shared/schemas"

export const defaultGalleryContent: GalleryContent = {
  title: "Our Gallery",
  description: "Browse through our collection",
  images: [
    {
      src: "/demo-img.png",
      alt: "Gallery image 1",
      caption: "Image 1"
    },
    {
      src: "/demo-img.png",
      alt: "Gallery image 2",
      caption: "Image 2"
    },
    {
      src: "/demo-img.png",
      alt: "Gallery image 3",
      caption: "Image 3"
    }
  ],
  layout: "grid",
  columns: "3",
  showCaptions: true
}
