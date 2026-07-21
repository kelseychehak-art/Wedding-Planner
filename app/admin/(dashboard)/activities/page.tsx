import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import ActivitiesManager, { type Activity } from "./ActivitiesManager";

async function getActivities() {
  const token = await getAdminToken();
  if (!token)
    return {
      activities: [] as Activity[],
      timezone: "Europe/Rome",
      signupOpens: "",
      signupCloses: "",
    };

  const [{ data }, { data: settings }] = await Promise.all([
    supabase.rpc("admin_list_activities", { p_token: token }),
    supabase.rpc("admin_get_settings", { p_token: token }),
  ]);

  return {
    activities: (data ?? []) as Activity[],
    timezone: (settings?.timezone || "Europe/Rome") as string,
    signupOpens: (settings?.activity_signup_opens || "") as string,
    signupCloses: (settings?.activity_signup_closes || "") as string,
  };
}

export default async function ActivitiesAdminPage() {
  const { activities, timezone, signupOpens, signupCloses } = await getActivities();
  return (
    <ActivitiesManager
      initialActivities={activities}
      timezone={timezone}
      signupOpens={signupOpens}
      signupCloses={signupCloses}
    />
  );
}
