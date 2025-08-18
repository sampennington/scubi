import { Providers } from "./providers"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import { site } from "@/config/site"

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`
  },
  description: site.description,
  manifest: "/manifest.webmanifest",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    title: site.name,
    description: site.description,
    siteName: site.name
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-svh flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
