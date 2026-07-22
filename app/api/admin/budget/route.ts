import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

/*
 * Items, categories and payments behind one route — `entity` picks the RPC.
 * Replaces the old items/ and targets/ routes: category budgets used to live in
 * a `budget_category_targets` JSON blob in settings, and are now rows in
 * budget_categories with the rest of the category's data.
 */

const RPCS = {
  item: { upsert: "admin_upsert_budget_item", remove: "admin_delete_budget_item" },
  category: { upsert: "admin_upsert_budget_category", remove: "admin_delete_budget_category" },
  payment: { upsert: "admin_upsert_budget_payment", remove: "admin_delete_budget_payment" },
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
