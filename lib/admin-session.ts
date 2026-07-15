import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_token";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours, matches admin_authenticate RPC

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value ?? null;
}
