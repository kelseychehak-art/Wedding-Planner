import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import ItineraryManager, { type ItineraryData } from "./ItineraryManager";

const EMPTY: ItineraryData = { events: [], locations: [], tasks: [] };

async function getItinerary() {
  const token = await getAdminToken();
  if (!token)
    return { data: EMPTY, timezone: "Europe/Rome", invited: 0, defaultVisibility: "public" };

  const [{ data }, { data: settings }, { data: parties }] = await Promise.all([
    supabase.rpc("admin_get_itinerary", { p_token: token }),
    supabase.rpc("admin_get_settings", { p_token: token }),
    supabase.rpc("admin_list_guests", { p_token: token }),
  ]);

  const invited = ((parties ?? []) as { guests?: unknown[] }[]).reduce(
    (sum, p) => sum + (p.guests?.length ?? 0),
    0
  );

  return {
    data: (data ?? EMPTY) as ItineraryData,
    timezone: (settings?.timezone || "Europe/Rome") as string,
    invited,
    defaultVisibility: (settings?.event_default_visibility || "public") as string,
  };
}

export default async function ItineraryPage() {
  const { data, timezone, invited, defaultVisibility } = await getItinerary();
  return (
    <ItineraryManager
      data={data}
      timezone={timezone}
      invited={invited}
      defaultVisibility={defaultVisibility}
    />
  );
}
