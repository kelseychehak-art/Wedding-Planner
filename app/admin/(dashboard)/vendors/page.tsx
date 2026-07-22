import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import { getEurUsdRate, DEFAULT_EUR_USD_RATE } from "@/lib/admin-rate";
import VendorsManager, { type Vendor, type VendorTask } from "./VendorsManager";

async function getData() {
  const token = await getAdminToken();
  if (!token) {
    return { vendors: [] as Vendor[], tasks: [] as VendorTask[], eurUsdRate: DEFAULT_EUR_USD_RATE };
  }

  const [{ data: vendors }, { data: tasks }, eurUsdRate] = await Promise.all([
    supabase.rpc("admin_list_vendors", { p_token: token }),
    supabase.rpc("admin_list_vendor_tasks", { p_token: token }),
    getEurUsdRate(token),
  ]);

  return {
    vendors: (vendors ?? []) as Vendor[],
    tasks: (tasks ?? []) as VendorTask[],
    eurUsdRate,
  };
}

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; stage?: string }>;
}) {
  const [data, params] = await Promise.all([getData(), searchParams]);
  return (
    <VendorsManager
      vendors={data.vendors}
      tasks={data.tasks}
      eurUsdRate={data.eurUsdRate}
      initialTab={params.tab}
      initialStage={params.stage}
    />
  );
}
