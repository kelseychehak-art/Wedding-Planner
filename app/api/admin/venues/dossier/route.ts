import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

/*
 * Facts, images and open questions for the chosen venue — plus choosing it.
 * Same entity-dispatch shape as the budget and communications routes.
 */

const RPCS = {
  fact: { upsert: "admin_upsert_venue_fact", remove: "admin_delete_venue_fact" },
  image: { upsert: "admin_upsert_venue_image", remove: "admin_delete_venue_image" },
  question: { upsert: "admin_upsert_venue_question", remove: "admin_delete_venue_question" },
} as const;

type Entity = keyof typeof RPCS;

function rpcsFor(value: string | null) {
  return value && value in RPCS ? RPCS[value as Entity] : null;
}

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { entity, item, chooseVenueId } = (await request.json()) as {
    entity?: string;
    item?: unknown;
    chooseVenueId?: string;
  };

  /* Promoting a venue to "the one" is its own action, not an entity upsert. */
  if (chooseVenueId !== undefined) {
    const { data, error } = await supabase.rpc("admin_set_chosen_venue", {
      p_token: token,
      p_id: chooseVenueId || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ venue: data });
  }

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
