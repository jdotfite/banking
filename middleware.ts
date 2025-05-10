import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // DEBUGGING: Temporarily disable all complex routing logic
  // Just route root path to login
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // For all other URLs, just allow normal navigation
  // This disables the onboarding/preloader redirect logic for now
  
  // Create the response
  const response = NextResponse.next();
  
  // Add cache-busting headers for login page and in non-production environments
  if (pathname === '/login' || process.env.NODE_ENV !== 'production') {
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
