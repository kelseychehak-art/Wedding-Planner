import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/admin_valid`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_token: token }),
  });

  const valid = res.ok && (await res.json()) === true;

  if (!valid) {
    const redirectResponse = NextResponse.redirect(new URL("/admin/login", request.url));
    redirectResponse.cookies.delete(ADMIN_COOKIE_NAME);
    return redirectResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
