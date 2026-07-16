import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import TimelineManager, { type Milestone } from "./TimelineManager";

async function getMilestones(): Promise<Milestone[]> {
  const token = await getAdminToken();
  if (!token) return [];
  const { data } = await supabase.rpc("admin_list_milestones", { p_token: token });
  return (data ?? []) as Milestone[];
}

export default async function TimelinePage() {
  const milestones = await getMilestones();
  return <TimelineManager initialItems={milestones} />;
}
