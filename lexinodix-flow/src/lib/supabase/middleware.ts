import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // No Database generic — avoids 'never' inference on table queries
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Always use getUser() — never getSession() — to refresh the token correctly
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const protectedPaths = ['/dashboard', '/workspace', '/notes', '/files', '/chat', '/search', '/settings'];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Only redirect login/signup — never /auth/callback (breaks OAuth)
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/signup' || pathname === '/';
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}
