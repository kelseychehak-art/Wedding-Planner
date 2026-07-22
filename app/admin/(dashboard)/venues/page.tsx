import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import VenueHome, { type Dossier, type OtherVenue } from "./VenueHome";

/*
 * The Venues page is now the chosen venue's home rather than a comparison
 * tool — the choice has been made, so the page's job changed from "which one?"
 * to "everything we know about this one, and where each fact came from".
 *
 * The venues that weren't chosen are still here, collapsed at the bottom. The
 * research behind them is real, and a venue can still fall through.
 */
async function getDossier(): Promise<Dossier | null> {
  const token = await getAdminToken();
  if (!token) return null;
  const { data } = await supabase.rpc("admin_get_venue_dossier", { p_token: token });
  return (data ?? null) as Dossier | null;
}

/* Only needed for the "nothing chosen yet" state, so it's fetched separately. */
async function getCandidates(): Promise<OtherVenue[]> {
  const token = await getAdminToken();
  if (!token) return [];
  const { data } = await supabase.rpc("admin_list_venues", { p_token: token });
  return ((data ?? []) as Record<string, unknown>[]).map((v) => ({
    id: String(v.id),
    name: String(v.name),
    location: (v.location as string) ?? null,
    stage: String(v.stage ?? ""),
    verdict: (v.research_verdict as string) ?? null,
    budget_fit: (v.budget_fit as string) ?? null,
  }));
}

export default async function AdminVenuesPage() {
  const dossier = await getDossier();
  const candidates = dossier?.venue ? [] : await getCandidates();

  return <VenueHome dossier={dossier} candidates={candidates} />;
}
