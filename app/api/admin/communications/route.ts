import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

/*
 * Messages, templates and recipient groups share one route: three near-identical
 * upsert/delete pairs in three files would be the same code three times.
 * `entity` picks the RPC; anything else is rejected rather than interpolated.
 */

const RPCS = {
  message: { upsert: "admin_upsert_message", remove: "admin_delete_message" },
  template: { upsert: "admin_upsert_comm_template", remove: "admin_delete_comm_template" },
  group: { upsert: "admin_upsert_comm_group", remove: "admin_delete_comm_group" },
} as const;

type Entity = keyof typeof RPCS;

function rpcsFor(value: string | null) {
  return value && value in RPCS ? RPCS[value as Entity] : null;
}

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { entity, item } = (await request.json()) as { entity?: string; item?: unknown };
  const rpcs = rpcsFor(entity ?? null);
  if (!rpcs) return NextResponse.json({ error: "Unknown record type." }, { status: 400 });

  const { data, error } = await supabase.rpc(rpcs.upsert, { p_token: token, p_item: item });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}

export async function DELETE(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const rpcs = rpcsFor(searchParams.get("entity"));
  const id = searchParams.get("id");
  if (!rpcs) return NextResponse.json({ error: "Unknown record type." }, { status: 400 });
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const { error } = await supabase.rpc(rpcs.remove, { p_token: token, p_id: id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
