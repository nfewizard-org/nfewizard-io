import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  const isPublicAsset = request.nextUrl.pathname.startsWith('/_next') || 
                        request.nextUrl.pathname.match(/\.(png|jpg|jpeg|svg|ico)$/);

  if (isLoginPage || isAuthRoute || isPublicAsset) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // If it's an API route other than auth, return 401
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Otherwise redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
