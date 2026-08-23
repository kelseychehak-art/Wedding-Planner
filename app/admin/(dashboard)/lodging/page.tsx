import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import LodgingManager, {
  type LodgingData,
  type Household,
  type Pricing,
  type ChildBracket,
} from "./LodgingManager";

type GuestRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_child: boolean | null;
  age: number | null;
};
type PartyRow = { id: string; name: string; guests?: GuestRow[] };

const EMPTY: LodgingData = {
  properties: [],
  rooms: [],
  assignments: [],
  requests: [],
};

const DEFAULT_PRICING: Pricing = { adultPrice: null, brackets: [] };

function parsePricing(settings: Record<string, string> | null): Pricing {
  if (!settings) return DEFAULT_PRICING;
  const adultRaw = settings.lodging_adult_price;
  const adultPrice = adultRaw != null && adultRaw !== "" ? Number(adultRaw) : null;
  let brackets: ChildBracket[] = [];
  try {
    const parsed = JSON.parse(settings.lodging_child_brackets || "[]");
    if (Array.isArray(parsed)) {
      brackets = parsed.map((b) => ({
        label: String(b.label ?? ""),
        maxAge: b.max_age == null ? null : Number(b.max_age),
        price: b.price == null ? null : Number(b.price),
      }));
    }
  } catch {
    brackets = [];
  }
  return { adultPrice, brackets };
}

async function getLodging() {
  const token = await getAdminToken();
  if (!token)
    return { data: EMPTY, households: [] as Household[], pricing: DEFAULT_PRICING };

  const [{ data }, { data: parties }, { data: settings }] = await Promise.all([
    supabase.rpc("admin_get_lodging", { p_token: token }),
    supabase.rpc("admin_list_guests", { p_token: token }),
    supabase.rpc("admin_get_settings", { p_token: token }),
  ]);

  const households: Household[] = ((parties ?? []) as PartyRow[])
    .filter((p) => p.name && p.name.trim() !== "")
    .map((p) => ({
    id: p.id,
    name: p.name,
    people: (p.guests ?? []).map((g) => ({
      id: g.id,
      firstName: [g.first_name, g.last_name].filter(Boolean).join(" ") || "Guest",
      isChild: !!g.is_child,
      age: g.age ?? null,
    })),
  }));

  return {
    data: (data ?? EMPTY) as LodgingData,
    households,
    pricing: parsePricing((settings ?? null) as Record<string, string> | null),
  };
}

export default async function LodgingPage() {
  const { data, households, pricing } = await getLodging();
  return <LodgingManager data={data} households={households} pricing={pricing} />;
}
