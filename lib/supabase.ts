import { createBrowserClient } from "@supabase/ssr";
import {
  supabasePublishableKey,
  supabaseUrl,
} from "./supabase-public-config.generated";

export function getSupabase() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("A configuração pública do Supabase não foi gerada.");
  }
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
