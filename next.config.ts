import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: false
    }
  },
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
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
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
