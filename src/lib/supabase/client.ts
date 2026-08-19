import { createBrowserClient } from "@supabase/ssr";

function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function createClient() {
  const key = getSupabaseKey();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or anon/publishable key");
  }
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key);
}
