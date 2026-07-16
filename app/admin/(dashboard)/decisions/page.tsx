import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import DecisionsManager, { type Decision } from "./DecisionsManager";

async function getDecisions(): Promise<Decision[]> {
  const token = await getAdminToken();
  if (!token) return [];
  const { data } = await supabase.rpc("admin_list_decisions", { p_token: token });
  return (data ?? []) as Decision[];
}

export default async function DecisionsPage() {
  const decisions = await getDecisions();
  return <DecisionsManager initialItems={decisions} />;
}
