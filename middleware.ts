import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('user_id')
  
  // Protect all board routes
  if (!isLoggedIn && request.nextUrl.pathname.startsWith('/board')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/board', request.url))
  }
}
 
export const config = {
  matcher: ['/board/:path*', '/login', '/signup',"/"]
} 