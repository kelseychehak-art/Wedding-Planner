import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import TravelManager, { type Itinerary, type PartyOption } from "./TravelManager";

type PartyRow = {
  id: string;
  name: string;
  side: string | null;
  guests?: { id: string; first_name: string }[];
};

async function getTravel() {
  const token = await getAdminToken();
  if (!token) {
    return { itineraries: [], parties: [], travelDeadline: "", timezone: "Europe/Rome" };
  }

  const [{ data: itineraries }, { data: parties }, { data: settings }] = await Promise.all([
    supabase.rpc("admin_list_travel", { p_token: token }),
    supabase.rpc("admin_list_guests", { p_token: token }),
    supabase.rpc("admin_get_settings", { p_token: token }),
  ]);

  const partyList = ((parties ?? []) as PartyRow[]).map((p) => ({
    id: p.id,
    name: p.name,
    side: p.side,
    guestCount: p.guests?.length ?? 0,
  }));

  return {
    itineraries: (itineraries ?? []) as Itinerary[],
    parties: partyList as PartyOption[],
    travelDeadline: (settings?.travel_deadline ?? "") as string,
    timezone: (settings?.timezone || "Europe/Rome") as string,
  };
}

export default async function TravelPage() {
  const { itineraries, parties, travelDeadline, timezone } = await getTravel();
  return (
    <TravelManager
      initialItineraries={itineraries}
      parties={parties}
      travelDeadline={travelDeadline}
      timezone={timezone}
    />
  );
}
