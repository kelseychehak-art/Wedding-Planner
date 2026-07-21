import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import BudgetManager, { type BudgetItem } from "./BudgetManager";

async function getBudget(): Promise<{
  total: number;
  currency: string;
  items: BudgetItem[];
  targets: Record<string, number>;
  eurUsdRate: number;
}> {
  const token = await getAdminToken();
  if (!token) return { total: 0, currency: "USD", items: [], targets: {}, eurUsdRate: 1.08 };

  const [{ data }, { data: settings }] = await Promise.all([
    supabase.rpc("admin_get_budget", { p_token: token }),
    supabase.rpc("admin_get_settings", { p_token: token }),
  ]);

  return {
    total: Number(data?.total ?? 0),
    currency: data?.currency ?? "USD",
    items: (data?.items ?? []) as BudgetItem[],
    targets: (data?.targets ?? {}) as Record<string, number>,
    eurUsdRate: Number(settings?.eur_usd_rate ?? 1.08) || 1.08,
  };
}

export default async function BudgetPage() {
  const { total, currency, items, targets, eurUsdRate } = await getBudget();
  return (
    <BudgetManager
      initialTotal={total}
      initialCurrency={currency}
      initialItems={items}
      initialTargets={targets}
      eurUsdRate={eurUsdRate}
    />
  );
}
