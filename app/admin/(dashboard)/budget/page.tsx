import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import { DEFAULT_EUR_USD_RATE } from "@/lib/admin-rate";
import BudgetManager, {
  type BudgetItem,
  type BudgetCategory,
  type BudgetPayment,
  type VendorOption,
} from "./BudgetManager";

async function getBudget() {
  const token = await getAdminToken();
  if (!token) {
    return {
      total: 0,
      currency: "USD",
      items: [] as BudgetItem[],
      categories: [] as BudgetCategory[],
      payments: [] as BudgetPayment[],
      vendors: [] as VendorOption[],
      eurUsdRate: DEFAULT_EUR_USD_RATE,
    };
  }

  /* Vendors come along so a budget line can be attached to one — that link is
     what lets the Vendors page report spend without keeping its own figures. */
  const [{ data }, { data: settings }, { data: vendors }] = await Promise.all([
    supabase.rpc("admin_get_budget", { p_token: token }),
    supabase.rpc("admin_get_settings", { p_token: token }),
    supabase.rpc("admin_list_vendors", { p_token: token }),
  ]);

  return {
    total: Number(data?.total ?? 0),
    currency: (data?.currency ?? "USD") as string,
    items: (data?.items ?? []) as BudgetItem[],
    categories: (data?.categories ?? []) as BudgetCategory[],
    payments: (data?.payments ?? []) as BudgetPayment[],
    vendors: (vendors ?? []) as VendorOption[],
    eurUsdRate: Number(settings?.eur_usd_rate ?? DEFAULT_EUR_USD_RATE) || DEFAULT_EUR_USD_RATE,
  };
}

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>;
}) {
  const [data, params] = await Promise.all([getBudget(), searchParams]);
  return (
    <BudgetManager
      initialTotal={data.total}
      initialCurrency={data.currency}
      initialItems={data.items}
      initialCategories={data.categories}
      initialPayments={data.payments}
      vendors={data.vendors}
      eurUsdRate={data.eurUsdRate}
      initialTab={params.tab}
      initialCategoryId={params.category}
    />
  );
}
