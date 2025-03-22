// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export const REDIRECT = '/';
export const PUBLIC_ROUTES = ['/'];
export const MEMBER_ROUTE = ['/profile'];
export const ADMIN_ROUTE = ['/dashboard'];
export const AUTH_ROUTES = ['/login', '/register', '/auth/forgot-password'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const pathname = request.nextUrl.pathname
  
  // Check if the route is in AUTH_ROUTES (login/register pages)
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    // If user is already logged in, redirect to home page
    if (token) {
      return NextResponse.redirect(new URL(REDIRECT, request.url))
    }
    // Allow access to auth pages for non-logged-in users
    return NextResponse.next()
  }
  
  // Check if the route is in ADMIN_ROUTE
  if (ADMIN_ROUTE.some(route => pathname.startsWith(route))) {
    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check if user has admin role
    if (token.role !== 'Admin') {
      return NextResponse.redirect(new URL(REDIRECT, request.url))
    }
  }
  
  // Check if the route is in MEMBER_ROUTE
  if (MEMBER_ROUTE.some(route => pathname.startsWith(route))) {
    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all paths except public assets and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}