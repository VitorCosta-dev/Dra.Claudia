import { createBrowserClient } from "@supabase/ssr";

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Configure a URL e a publishable key do Supabase.");
  return createBrowserClient(url, key);
}
