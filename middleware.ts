import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No Firebase client-side middleware like Supabase,
// so we'll use a simple cookie check instead
export async function middleware(req: NextRequest) {
  const authCookie = req.cookies.get('firebase-auth-token');
  const isLoggedIn = !!authCookie;
  
  // If user is signed in and the current path is / or /auth, redirect to /dashboard
  if (isLoggedIn && (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // For dashboard routes, we'll let client-side auth handle redirects
  // as Firebase doesn't have server middleware
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*'],
};