import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export const ADMIN_COOKIE_NAME = "admin_token";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours, matches admin_authenticate RPC

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value ?? null;
}

/**
 * Storage operations use the service-role key and bypass RLS, so unlike the
 * admin_* RPCs (which self-check admin_valid), routes touching Storage must
 * validate the session explicitly before doing anything.
 */
export async function requireAdminToken(): Promise<string | null> {
  const token = await getAdminToken();
  if (!token) return null;
  const { data } = await supabase.rpc("admin_valid", { p_token: token });
  return data === true ? token : null;
}
