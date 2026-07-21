import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

const RPC_BY_KIND: Record<string, string> = {
  event: "admin_upsert_event",
  location: "admin_upsert_event_location",
};

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { kind, ...payload } = await request.json();
  const rpc = RPC_BY_KIND[kind ?? "event"];
  if (!rpc) {
    return NextResponse.json({ error: "Unknown record kind." }, { status: 400 });
  }

  const { data, error } = await supabase.rpc(rpc, { p_token: token, p_payload: payload });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, record: data });
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

  const { error } = await supabase.rpc("admin_delete_event", { p_token: token, p_id: id });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
