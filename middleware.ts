import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the user is authenticated by looking for a token in cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const selectedUserId = request.cookies.get('selectedUserId')?.value;
  const isAuthenticated = !!authToken;
  const isNewUser = selectedUserId === 'new';
  
  // Public paths that don't require authentication
  const publicPaths = ['/onboarding', '/login', '/signup', '/forgot-password'];
  
  // If it's a new user, allow access to onboarding flow
  if (isNewUser && publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // If the user is authenticated and trying to access onboarding/login/signup
  if (isAuthenticated && publicPaths.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // Create the response
  const response = NextResponse.next();
  
  // Add cache-busting headers for login page and in development mode
  if (pathname === '/login' || process.env.NODE_ENV === 'development') {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    // Add a timestamp header for debugging
    response.headers.set('X-Cache-Timestamp', new Date().toISOString());
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api|.*\\.png$|.*\\.svg$).*)',
  ],
};
