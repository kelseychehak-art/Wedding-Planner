import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const { data: token, error } = await supabase.rpc("admin_authenticate", {
    p_password: password,
  });

  if (error || !token) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
