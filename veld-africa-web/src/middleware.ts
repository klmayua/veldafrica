import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

// Role-based route access
const routePermissions: Record<string, string[]> = {
  "/admin": ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],
  "/admin/projects": ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],
  "/admin/projects/new": ["SUPER_ADMIN", "ADMIN"],
  "/admin/projects/edit": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "/admin/properties": ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],
  "/admin/properties/new": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "/admin/newsletters": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "/admin/newsletters/new": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "/admin/newsletters/send": ["SUPER_ADMIN", "ADMIN"],
  "/admin/users": ["SUPER_ADMIN", "ADMIN"],
  "/admin/settings": ["SUPER_ADMIN", "ADMIN"],
  "/admin/analytics": ["SUPER_ADMIN", "ADMIN"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route requires authentication
  const isAdminRoute = pathname.startsWith("/admin")
  const isApiRoute = pathname.startsWith("/api/admin")

  if (!isAdminRoute && !isApiRoute) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Not logged in - redirect to login
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based permissions for admin routes
  if (isAdminRoute) {
    const userRole = token.role as string

    // Find matching permission pattern
    const matchingRoute = Object.keys(routePermissions).find((route) =>
      pathname.startsWith(route)
    )

    if (matchingRoute) {
      const allowedRoles = routePermissions[matchingRoute]
      if (!allowedRoles.includes(userRole)) {
        // Redirect to unauthorized or dashboard
        return NextResponse.redirect(new URL("/admin/unauthorized", request.url))
      }
    }

    // Super admin bypass
    if (userRole === "SUPER_ADMIN") {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
