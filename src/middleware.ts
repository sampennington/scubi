import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""

  // Handle subdomain routing for site previews
  // Production: shopname.yourdomain.com
  // Development: shopname.localhost:3000
  if (
    (hostname.includes(".yourdomain.com") && !hostname.startsWith("www.")) ||
    (hostname.includes(".localhost:") && !hostname.startsWith("www."))
  ) {
    const shopId = hostname.split(".")[0]

    // Rewrite to preview route with shopId
    const url = request.nextUrl.clone()
    url.pathname = `/preview/${shopId}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Check cookie for optimistic redirects for protected routes
  // Use getSession in your RSC to protect a route via SSR or useAuthenticate client side
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const redirectTo = request.nextUrl.pathname + request.nextUrl.search
    return NextResponse.redirect(
      new URL(`/auth/sign-in?redirectTo=${redirectTo}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  // Protected routes - all dashboard routes and auth settings
  matcher: [
    "/dashboard/:path*",
    "/auth/settings",
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)"
  ]
}
