import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/preview/:path*",
        has: [
          {
            type: "host",
            value: "(?<shopId>[^.]+)\.yourdomain\.com"
          }
        ]
      }
    ]
  }
}

export default nextConfig
