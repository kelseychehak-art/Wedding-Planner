import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import GuestsManager, { type Party, type WeekendEvent } from "./GuestsManager";

/*
 * The Weekend Events column is a dot matrix, so it needs the full set of
 * RSVP-enabled events as its columns — not just the ones a given guest happens
 * to be invited to. Those come from the itinerary alongside the guest list.
 */
async function getData(): Promise<{ parties: Party[]; events: WeekendEvent[] }> {
  const token = await getAdminToken();
  if (!token) return { parties: [], events: [] };

  const [{ data: parties }, { data: itinerary }] = await Promise.all([
    supabase.rpc("admin_list_guests", { p_token: token }),
    supabase.rpc("admin_get_itinerary", { p_token: token }),
  ]);

  const events = (((itinerary ?? {}) as { events?: WeekendEvent[] }).events ?? [])
    .filter((e) => e.rsvp_enabled)
    .sort((a, b) => (a.starts_at ?? "").localeCompare(b.starts_at ?? ""));

  return { parties: (parties ?? []) as Party[], events };
}

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; tab?: string }>;
}) {
  const [{ parties, events }, params] = await Promise.all([getData(), searchParams]);
  return (
    <GuestsManager
      initialParties={parties}
      events={events}
      initialView={params.view}
      initialTab={params.tab}
    />
  );
}
