import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import LodgingManager, {
  type LodgingData,
  type PartyOption,
} from "./LodgingManager";

type PartyRow = { id: string; name: string; guests?: { id: string }[] };

const EMPTY: LodgingData = {
  properties: [],
  rooms: [],
  assignments: [],
  requests: [],
};

async function getLodging() {
  const token = await getAdminToken();
  if (!token) return { data: EMPTY, parties: [] as PartyOption[] };

  const [{ data }, { data: parties }] = await Promise.all([
    supabase.rpc("admin_get_lodging", { p_token: token }),
    supabase.rpc("admin_list_guests", { p_token: token }),
  ]);

  return {
    data: (data ?? EMPTY) as LodgingData,
    parties: ((parties ?? []) as PartyRow[]).map((p) => ({
      id: p.id,
      name: p.name,
      guestCount: p.guests?.length ?? 0,
    })),
  };
}

export default async function LodgingPage() {
  const { data, parties } = await getLodging();
  return <LodgingManager data={data} parties={parties} />;
}
