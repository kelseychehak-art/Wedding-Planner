import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

/**
 * Bulk read/write for the admin settings key/value store.
 * The RPCs refuse to read or write `admin_password_hash`.
 */
export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const settings = body?.settings;

  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return NextResponse.json({ error: "settings object is required." }, { status: 400 });
  }

  // Coerce every value to a string — the store is text key/value.
  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(settings as Record<string, unknown>)) {
    payload[key] = value == null ? "" : String(value);
  }

  const { data, error } = await supabase.rpc("admin_set_settings", {
    p_token: token,
    p_settings: payload,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, settings: data });
}
