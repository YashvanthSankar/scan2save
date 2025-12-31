import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define Route Types
  const publicPaths = [
    '/',
    '/login',
    '/get-qrs',
    '/privacy',
    '/terms',
    '/about',
    '/contact',
    '/for-retailers',
    '/for-shoppers',
  ];

  const isPublicRoute =
    publicPaths.includes(path) ||
    path.startsWith('/api') || // APIs handle their own auth usually, or strictly public
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.includes('.'); // files like favicon.ico, etc.

  const isAdminRoute = path.startsWith('/admin');
  const isProtectedUserRoute = !isPublicRoute && !isAdminRoute; // e.g., /dashboard, /scan, /store, /cart

  // 2. Get Session Cookie
  const sessionCookie = request.cookies.get('session');
  let session = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {
      console.error('Failed to parse session cookie', e);
    }
  }

  const isAuthenticated = !!session?.userId;
  const isAdmin = session?.role === 'ADMIN';

  // 3. LOGIC: Unauthenticated Users
  if (!isAuthenticated) {
    if (isProtectedUserRoute || isAdminRoute) {
      // Redirect to login, preserving the destination
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', path);
      return NextResponse.redirect(loginUrl);
    }
    // Allow public routes
    return NextResponse.next();
  }

  // 4. LOGIC: Authenticated Users
  if (isAuthenticated) {
    // Prevent access to /login if already logged in
    if (path === '/login') {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Role-Based Access Control
    if (isAdminRoute && !isAdmin) {
      // User trying to access Admin -> Send to User Dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};