import { supabase } from "@/lib/supabase";

/*
 * The EUR→USD rate every money display converts with (docs/decisions.md D12).
 * A hand-maintained planning estimate from Settings → Wedding Details, not a
 * live FX feed. Centralised so pages can't drift onto different rates.
 */
export const DEFAULT_EUR_USD_RATE = 1.08;

export async function getEurUsdRate(token: string): Promise<number> {
  const { data } = await supabase.rpc("admin_get_settings", { p_token: token });
  const raw = Number((data as Record<string, string> | null)?.eur_usd_rate);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_EUR_USD_RATE;
}
