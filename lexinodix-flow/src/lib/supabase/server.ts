import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// We intentionally do NOT pass the Database generic here.
// Passing a custom Database type causes TypeScript to infer 'never'
// on table queries when local type definitions don't exactly match
// the live Supabase schema — which breaks Vercel builds.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch { }
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch { }
        },
      },
    }
  );
}

// Admin client — bypasses RLS (server-side only)
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined; },
        set() { },
        remove() { },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
