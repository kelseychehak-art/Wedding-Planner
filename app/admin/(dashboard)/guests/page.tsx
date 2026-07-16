import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import GuestsManager, { type Party } from "./GuestsManager";

async function getParties(): Promise<Party[]> {
  const token = await getAdminToken();
  if (!token) return [];
  const { data } = await supabase.rpc("admin_list_guests", { p_token: token });
  return (data ?? []) as Party[];
}

export default async function GuestsPage() {
  const parties = await getParties();
  return <GuestsManager initialParties={parties} />;
}
