import { notFound } from "next/navigation";
import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import VendorForm, { type CommunicationEntry, type VendorRecord } from "./VendorForm";

function toFormVendor(row: Record<string, unknown>): VendorRecord {
  const str = (k: string) => (row[k] == null ? "" : String(row[k]));
  return {
    id: str("id"),
    name: str("name"),
    category: str("category") || "Other",
    stage: str("stage") || "Researching",
    contact_name: str("contact_name"),
    contact_email: str("contact_email"),
    contact_phone: str("contact_phone"),
    website: str("website"),
    location: str("location"),
    estimated_cost: str("estimated_cost"),
    deposit_amount: str("deposit_amount"),
    currency: str("currency") || "EUR",
    payment_terms: str("payment_terms"),
    deliverables: str("deliverables"),
    hours_coverage: str("hours_coverage"),
    cancellation_terms: str("cancellation_terms"),
    next_action: str("next_action"),
    notes: str("notes"),
    why_we_love_it: str("why_we_love_it"),
    why_we_hesitate: str("why_we_hesitate"),
    questions_remaining: str("questions_remaining"),
    decision: str("decision"),
  };
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return <VendorForm initialVendor={null} initialCommunications={[]} />;
  }

  const token = await getAdminToken();
  const { data } = await supabase.rpc("admin_get_vendor", { p_token: token, p_id: id });

  if (!data) notFound();

  const vendor = toFormVendor(data.vendor);
  const communications = (data.communications ?? []) as CommunicationEntry[];

  return <VendorForm initialVendor={vendor} initialCommunications={communications} />;
}
