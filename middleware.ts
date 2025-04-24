import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './lib/supabase/types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is signed in and the current path is / or /auth, redirect to /dashboard
  if (session && (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user is not signed in and the current path is /dashboard, redirect to /auth/login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
};