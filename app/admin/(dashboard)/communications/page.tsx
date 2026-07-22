import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import type { Party } from "../guests/GuestsManager";
import CommunicationsManager, {
  type Message,
  type Template,
  type RecipientGroup,
} from "./CommunicationsManager";

/*
 * The guest list comes down with the messages: recipient rules resolve against
 * live guest data, so the counts on this page have to be computed from the same
 * records the Guest List shows rather than a stored number that drifts.
 */
async function getData() {
  const token = await getAdminToken();
  if (!token) {
    return { messages: [], templates: [], groups: [], parties: [] as Party[] };
  }

  const [{ data: comms }, { data: parties }] = await Promise.all([
    supabase.rpc("admin_list_communications", { p_token: token }),
    supabase.rpc("admin_list_guests", { p_token: token }),
  ]);

  const payload = (comms ?? {}) as {
    messages?: Message[];
    templates?: Template[];
    groups?: RecipientGroup[];
  };

  return {
    messages: payload.messages ?? [],
    templates: payload.templates ?? [],
    groups: payload.groups ?? [],
    parties: (parties ?? []) as Party[],
  };
}

export default async function CommunicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [data, params] = await Promise.all([getData(), searchParams]);
  return (
    <CommunicationsManager
      initialMessages={data.messages}
      initialTemplates={data.templates}
      initialGroups={data.groups}
      parties={data.parties}
      initialTab={params.tab}
    />
  );
}
