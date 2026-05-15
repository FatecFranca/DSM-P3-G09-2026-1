import { NextResponse } from "next/server"

export function middleware(request) {

  const token =
    request.cookies.get("token")

  const pathname =
    request.nextUrl.pathname

  const publicRoutes = [
    "/login"
  ]

  const isPublicRoute =
    publicRoutes.includes(pathname)

  if (!token && !isPublicRoute) {

    return NextResponse.redirect(
      new URL("/login", request.url)
    )

  }

  if (token && pathname === "/login") {

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    )

  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}