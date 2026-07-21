import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import SettingsManager from "./SettingsManager";

async function getSettings(): Promise<Record<string, string>> {
  const token = await getAdminToken();
  if (!token) return {};
  const { data } = await supabase.rpc("admin_get_settings", { p_token: token });
  return (data ?? {}) as Record<string, string>;
}

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsManager initialSettings={settings} />;
}
