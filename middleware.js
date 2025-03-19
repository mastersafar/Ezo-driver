import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token'); // Retrieve the token
  const { pathname } = request.nextUrl;

  console.log('Pathname:', pathname); // Debugging: Log the current path
  console.log('Token:', token?.value); // Debugging: Log the token value


    // Redirect unauthenticated users trying to access protected routes
  if (!token?.value && (pathname.startsWith('/dashboard') 
      || pathname === '/ordersMenu'
      || pathname === '/activeOrders'
      || pathname === '/account')) {
    console.log('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent authenticated users from accessing the login page
  if (pathname === '/login' && token?.value) {
    console.log('Token exists, redirecting to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
    // Dynamically revalidate specific paths
    if (pathname === '/dump') {
      request.nextUrl.searchParams.set('revalidate', 'true');
    }

    const response = NextResponse.next();

    // Set Cache-Control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  
    return response;
  
  }

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/about'], // Protect login, dashboard, and about routes
};
