import { notFound } from "next/navigation";
import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import VenueForm, {
  type CommunicationEntry,
  type DocumentEntry,
  type VenueRecord,
} from "./VenueForm";

function toFormVenue(row: Record<string, unknown>): VenueRecord {
  const str = (k: string) => (row[k] == null ? "" : String(row[k]));
  return {
    id: str("id"),
    name: str("name"),
    location: str("location"),
    country: str("country"),
    region: str("region"),
    website: str("website"),
    contact_name: str("contact_name"),
    contact_email: str("contact_email"),
    contact_phone: str("contact_phone"),
    stage: str("stage") || "Researching",
    availability: str("availability"),
    capacity: str("capacity"),
    sleeping_capacity: str("sleeping_capacity"),
    has_pool: Boolean(row.has_pool),
    has_outdoor_space: Boolean(row.has_outdoor_space),
    exclusive_buyout: Boolean(row.exclusive_buyout),
    minimum_nights: str("minimum_nights"),
    estimated_total_price: str("estimated_total_price"),
    currency: str("currency") || "EUR",
    accommodation_cost_note: str("accommodation_cost_note"),
    wedding_day_cost_note: str("wedding_day_cost_note"),
    airport_distance: str("airport_distance"),
    curfew: str("curfew"),
    noise_restrictions: str("noise_restrictions"),
    catering_model: str("catering_model"),
    notes: str("notes"),
    why_we_love_it: str("why_we_love_it"),
    why_we_hesitate: str("why_we_hesitate"),
    questions_remaining: str("questions_remaining"),
    decision: str("decision"),
    elimination_reason: str("elimination_reason"),
    kelsey_comments: str("kelsey_comments"),
    andrew_comments: str("andrew_comments"),
  };
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <VenueForm initialVenue={null} initialCommunications={[]} initialDocuments={[]} />
    );
  }

  const token = await getAdminToken();
  const { data } = await supabase.rpc("admin_get_venue", { p_token: token, p_id: id });

  if (!data) {
    notFound();
  }

  const venue = toFormVenue(data.venue);
  const communications = (data.communications ?? []) as CommunicationEntry[];
  const documents = (data.documents ?? []) as DocumentEntry[];

  return (
    <VenueForm
      initialVenue={venue}
      initialCommunications={communications}
      initialDocuments={documents}
    />
  );
}
