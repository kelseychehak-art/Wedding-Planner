import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

/* Follow-up tasks against a vendor — "chase the quote", "confirm headcount". */

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const item = await request.json();
  const { data, error } = await supabase.rpc("admin_upsert_vendor_task", {
    p_token: token,
    p_item: item,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}

export async function DELETE(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const { error } = await supabase.rpc("admin_delete_vendor_task", { p_token: token, p_id: id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
