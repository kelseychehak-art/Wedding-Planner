import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import BudgetManager, { type BudgetItem } from "./BudgetManager";

async function getBudget(): Promise<{
  total: number;
  currency: string;
  items: BudgetItem[];
  targets: Record<string, number>;
}> {
  const token = await getAdminToken();
  if (!token) return { total: 0, currency: "USD", items: [], targets: {} };
  const { data } = await supabase.rpc("admin_get_budget", { p_token: token });
  return {
    total: Number(data?.total ?? 0),
    currency: data?.currency ?? "USD",
    items: (data?.items ?? []) as BudgetItem[],
    targets: (data?.targets ?? {}) as Record<string, number>,
  };
}

export default async function BudgetPage() {
  const { total, currency, items, targets } = await getBudget();
  return (
    <BudgetManager
      initialTotal={total}
      initialCurrency={currency}
      initialItems={items}
      initialTargets={targets}
    />
  );
}
