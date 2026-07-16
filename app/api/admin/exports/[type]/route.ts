import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminToken } from "@/lib/admin-session";
import { toCsv } from "@/lib/csv";

type Guest = {
  first_name: string;
  is_child: boolean;
  rsvp_status: string;
  meal_choice: string | null;
  dietary_restrictions: string | null;
  allergies: string | null;
  accessibility_needs: string | null;
};
type Party = {
  name: string;
  side: string | null;
  email: string | null;
  phone: string | null;
  mailing_address: string | null;
  guests?: Guest[];
  travel?: {
    arrival_date: string | null;
    departure_date: string | null;
    flight_info: string | null;
    room_assignment: string | null;
    needs_shuttle: boolean;
  } | null;
};

async function buildCsv(type: string, token: string): Promise<{ name: string; csv: string } | null> {
  switch (type) {
    case "guests": {
      const { data } = await supabase.rpc("admin_list_guests", { p_token: token });
      const parties = (data ?? []) as Party[];
      const rows: unknown[][] = [];
      for (const p of parties) {
        const guests = p.guests ?? [];
        if (guests.length === 0) {
          rows.push([p.name, p.side, p.email, p.phone, p.mailing_address, "", "", "", "", "", "", ""]);
        }
        for (const g of guests) {
          rows.push([
            p.name, p.side, p.email, p.phone, p.mailing_address,
            g.first_name, g.is_child ? "Yes" : "", g.rsvp_status,
            g.meal_choice, g.dietary_restrictions, g.allergies, g.accessibility_needs,
          ]);
        }
      }
      return {
        name: "guests-and-rsvps",
        csv: toCsv(
          ["Party", "Side", "Email", "Phone", "Mailing Address", "Guest", "Child", "RSVP", "Meal", "Dietary", "Allergies", "Accessibility"],
          rows
        ),
      };
    }
    case "travel": {
      const { data } = await supabase.rpc("admin_list_guests", { p_token: token });
      const parties = (data ?? []) as Party[];
      const rows = parties
        .filter((p) => p.travel)
        .map((p) => [
          p.name, p.travel!.arrival_date, p.travel!.departure_date,
          p.travel!.flight_info, p.travel!.room_assignment,
          p.travel!.needs_shuttle ? "Yes" : "",
        ]);
      return {
        name: "travel-and-shuttle",
        csv: toCsv(["Party", "Arrival", "Departure", "Flight Info", "Room", "Needs Shuttle"], rows),
      };
    }
    case "venues": {
      const { data } = await supabase.rpc("admin_list_venues", { p_token: token });
      const venues = (data ?? []) as Record<string, unknown>[];
      const rows = venues.map((v) => [
        v.name, v.research_verdict, v.budget_fit, v.exclusivity_status, v.stage,
        v.location, v.region, v.country, v.capacity, v.sleeping_capacity, v.minimum_nights,
        v.accommodation_cost_note, v.wedding_day_cost_note, v.research_notes, v.questions_remaining,
      ]);
      return {
        name: "venue-comparison",
        csv: toCsv(
          ["Venue", "Verdict", "Budget Fit", "Exclusivity", "Stage", "Location", "Region", "Country", "Capacity", "Sleeps", "Min Nights", "Accommodation Cost", "Wedding-Day Cost", "Research Notes", "Questions Remaining"],
          rows
        ),
      };
    }
    case "vendors": {
      const { data } = await supabase.rpc("admin_list_vendors", { p_token: token });
      const vendors = (data ?? []) as Record<string, unknown>[];
      const rows = vendors.map((v) => [
        v.name, v.category, v.stage, v.contact_name, v.contact_email, v.contact_phone,
        v.estimated_cost, v.deposit_amount, v.currency, v.payment_terms,
      ]);
      return {
        name: "vendor-contacts",
        csv: toCsv(
          ["Vendor", "Category", "Stage", "Contact", "Email", "Phone", "Estimated Cost", "Deposit", "Currency", "Payment Terms"],
          rows
        ),
      };
    }
    case "budget": {
      const { data } = await supabase.rpc("admin_get_budget", { p_token: token });
      const items = (data?.items ?? []) as Record<string, unknown>[];
      const rows = items.map((i) => [
        i.category, i.name, i.estimated_amount, i.amount_paid,
        (Number(i.estimated_amount ?? 0) - Number(i.amount_paid ?? 0)) || "",
        i.due_date, i.status, i.notes,
      ]);
      return {
        name: "budget-payment-schedule",
        csv: toCsv(
          ["Category", "Item", "Estimated", "Paid", "Outstanding", "Due Date", "Status", "Notes"],
          rows
        ),
      };
    }
    case "missing-info": {
      const { data } = await supabase.rpc("admin_list_guests", { p_token: token });
      const parties = (data ?? []) as Party[];
      const rows: unknown[][] = [];
      for (const p of parties) {
        const gaps: string[] = [];
        if (!p.email) gaps.push("no email");
        if (!p.phone) gaps.push("no phone");
        const guests = p.guests ?? [];
        if (guests.length === 0) gaps.push("no guests entered");
        const awaiting = guests.filter((g) => g.rsvp_status === "Invited" || g.rsvp_status === "Pending").length;
        if (awaiting > 0) gaps.push(`${awaiting} awaiting RSVP`);
        const confirmedNoMeal = guests.filter((g) => g.rsvp_status === "Confirmed" && !g.meal_choice).length;
        if (confirmedNoMeal > 0) gaps.push(`${confirmedNoMeal} confirmed without meal`);
        if (!p.travel) gaps.push("no travel info");
        if (gaps.length > 0) rows.push([p.name, p.email, p.phone, gaps.join("; ")]);
      }
      return {
        name: "missing-info-report",
        csv: toCsv(["Party", "Email", "Phone", "Missing / Outstanding"], rows),
      };
    }
    default:
      return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { type } = await params;
  const result = await buildCsv(type, token);
  if (!result) return NextResponse.json({ error: "Unknown export." }, { status: 404 });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(result.csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${result.name}-${date}.csv"`,
    },
  });
}
