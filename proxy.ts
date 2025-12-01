import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/server/auth/auth';

const publicRoutes = ['/'];
const onlyUnauthenticatedRoutes = ['/login', '/signup'];
const onlyAuthenticatedRoutes: string[] = [];
const onlyAdminRoutes = ['/dashboard'];

function matchesAny(pathname: string, routes: string[]) {
  return routes.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // allow public routes
  if (matchesAny(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // redirect to home if user is already authenticated and accessing only-unauthenticated routes
  if (session && matchesAny(pathname, onlyUnauthenticatedRoutes)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // redirect to login if route requires authentication and the user is not authenticated
  if (!session && matchesAny(pathname, onlyAuthenticatedRoutes)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // admin route checks
  if (matchesAny(pathname, onlyAdminRoutes)) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const role = session.user.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|trpc|_next/static|_next/image).*)'],
};
