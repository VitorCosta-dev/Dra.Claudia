import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminAccess =
  | { status: "authorized" }
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "mfa_required" }
  | { status: "error" };

export async function getAdminAccess(client: SupabaseClient): Promise<AdminAccess> {
  const { data: auth, error: authError } = await client.auth.getUser();
  if (authError) return { status: "error" };
  if (!auth.user) return { status: "unauthenticated" };

  const membership = await client.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (membership.error) return { status: "error" };
  if (!membership.data) return { status: "forbidden" };

  const assurance = await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance.error) return { status: "error" };
  if (assurance.data.currentLevel !== "aal2") return { status: "mfa_required" };
  return { status: "authorized" };
}
