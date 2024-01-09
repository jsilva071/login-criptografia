import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { validateToken } from './helpers/server/validateToken';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/login')) {
    const token = request.cookies.get('token')
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  }
  
  const token = request.cookies.get('token')
  const session = await validateToken(token?.value);
  const {response: res, error} = session;
  
  if (error) {
    const redirect = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);

    redirect.cookies.set({
      name: 'token',
      value: '',
      domain: process.env.APP_DOMAIN,
      expires: new Date('1970-01-01')
    })

    return redirect;
  }

  function requireLoggedOut() {
    if (data) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  }

  function requireLoggedIn() {
    if (data) {
      return response;
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  const data: any = await res?.json();

  if (request.nextUrl.pathname.startsWith('/login')) return requireLoggedOut();
  if (request.nextUrl.pathname.startsWith('/signup')) return requireLoggedOut();
  if (request.nextUrl.pathname === '/') return requireLoggedIn();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}