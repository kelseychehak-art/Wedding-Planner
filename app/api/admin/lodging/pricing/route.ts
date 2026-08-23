import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

/* Accommodation pricing: one flat adult price + JSON child age brackets. */
export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { adultPrice, brackets } = await request.json();
  const { error } = await supabase.rpc("admin_set_lodging_pricing", {
    p_token: token,
    p_adult: adultPrice == null ? "" : String(adultPrice),
    p_brackets: brackets ?? [],
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
