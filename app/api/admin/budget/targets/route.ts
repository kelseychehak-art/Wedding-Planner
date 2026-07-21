import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { category, amount } = await request.json();

  if (!category) {
    return NextResponse.json({ error: "Category is required." }, { status: 400 });
  }

  const parsed =
    amount === null || amount === "" || amount === undefined ? null : Number(amount);

  const { error } = await supabase.rpc("admin_set_budget_target", {
    p_token: token,
    p_category: category,
    p_amount: parsed,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
