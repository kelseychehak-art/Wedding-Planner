import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const payload = await request.json();
  const { data, error } = await supabase.rpc("admin_upsert_activity", {
    p_token: token,
    p_payload: payload,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, activity: data });
}

export async function DELETE(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const { error } = await supabase.rpc("admin_delete_activity", {
    p_token: token,
    p_id: id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
