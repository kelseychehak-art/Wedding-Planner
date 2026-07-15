import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type RsvpGuest = {
  id?: string;
  first_name: string;
  is_child: boolean;
  rsvp_status: "Confirmed" | "Declined";
  meal_choice: string | null;
  dietary_restrictions: string | null;
};

export type RsvpParty = {
  id: string;
  name: string;
  email: string | null;
  mailing_address: string | null;
  side: string | null;
  notes: string | null;
};

export async function findPartyForRsvp(name: string, email: string) {
  const { data, error } = await supabase.rpc("get_party_for_rsvp", {
    p_name: name,
    p_email: email,
  });
  if (error) throw error;
  return data as { party: RsvpParty; guests: RsvpGuest[] } | null;
}

export async function submitRsvp(partyId: string, guests: RsvpGuest[]) {
  const { error } = await supabase.rpc("submit_rsvp", {
    p_party_id: partyId,
    p_guests: guests,
  });
  if (error) throw error;
}
