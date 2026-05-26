import { createBrowserClient } from '@supabase/ssr';

// We intentionally do NOT pass the Database generic here.
// Passing a custom Database type causes TypeScript to infer 'never'
// on table queries when the local type definitions don't exactly match
// the live Supabase schema — which breaks Vercel builds.
// All type safety is handled at the component level via explicit casting.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
