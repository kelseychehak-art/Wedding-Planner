import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdminToken } from "@/lib/admin-session";
import { supabaseAdmin, VENUE_DOCUMENTS_BUCKET } from "@/lib/supabase-admin";

async function getDocumentStoragePath(docId: string) {
  // RLS on venue_documents has no direct-select policy (access is normally
  // RPC-only) — this uses the service-role client, safe here because the
  // caller has already been through requireAdminToken() above.
  const { data, error } = await supabaseAdmin
    .from("venue_documents")
    .select("storage_path")
    .eq("id", docId)
    .maybeSingle();
  if (error || !data) return null;
  return data.storage_path as string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const token = await requireAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { docId } = await params;
  const storagePath = await getDocumentStoragePath(docId);
  if (!storagePath) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin.storage
    .from(VENUE_DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, 60);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Couldn't sign URL." }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const token = await requireAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { docId } = await params;
  const storagePath = await getDocumentStoragePath(docId);
  if (!storagePath) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  await supabaseAdmin.storage.from(VENUE_DOCUMENTS_BUCKET).remove([storagePath]);

  const { error } = await supabase.rpc("admin_delete_venue_document", {
    p_token: token,
    p_id: docId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
