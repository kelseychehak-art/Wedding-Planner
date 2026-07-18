import type { Metadata } from "next";
import ContentPageFrame from "@/components/ContentPageFrame";
import Illustration from "@/components/Illustration";
import UiIcon from "@/components/UiIcon";
import ScallopFrame from "@/components/ScallopFrame";
import c from "@/components/gridCards.module.css";

export const metadata: Metadata = {
  title: "Travel · Kelsey & Andrew's Wedding Week",
  description:
    "Flights, transportation options, and tips to help you plan your journey to Tuscany for Kelsey & Andrew's wedding week.",
};

const AIRPORTS = [
  { code: "FLR", city: "Florence, Italy" },
  { code: "PSA", city: "Pisa, Italy" },
  { code: "ROM", city: "Rome, Italy" },
];

const TRANSPORT = [
  { title: "Private Shuttle", note: "Pre-book a group or private transfer" },
  { title: "Rent a Car", note: "Recommended for flexibility" },
  { title: "Train", note: "Scenic option to nearby towns" },
];

const TIPS = [
  {
    icon: "passport" as const,
    title: "Check passport validity",
    body: "It should be valid for at least six months after your return date.",
  },
  {
    icon: "shield" as const,
    title: "Travel insurance",
    body: "Recommended for international trips — peace of mind is worth it.",
  },
  {
    icon: "sparkle" as const,
    title: "Pack smart",
    body: "Comfortable shoes, sun protection, and layers for cooler evenings.",
  },
  {
    icon: "bulb" as const,
    title: "Stay connected",
    body: "Consider an international plan or an eSIM before you travel.",
  },
];

export default function TravelPage() {
  return (
    <ContentPageFrame
      title="Book Your Travel"
      subtitle="Flights, transportation options, and tips to help you plan your journey to Italy."
      heroIllustration="lemonBranch"
      footerLine="We can't wait to welcome you to Italy!"
    >
      <div className={c.grid}>
        {/* 1 — Getting to Italy */}
        <section className={c.card}>
          <div className={c.cardHead}>
            <span className={c.cardIcon}>
              <Illustration name="airplane" size={22} />
            </span>
            <h2 className={c.cardTitle}>Getting to Italy</h2>
          </div>
          <p className={c.cardIntro}>We recommend flying into one of the following airports:</p>
          <div className={c.list}>
            {AIRPORTS.map((a) => (
              <div key={a.code} className={c.rowItem}>
                <span className={c.rowLead}>{a.code}</span>
                <span className={c.rowText}>{a.city}</span>
              </div>
            ))}
          </div>
          <div className={c.callout}>
            <UiIcon name="info" size={16} className={c.calloutIcon} />
            <span className={c.calloutText}>
              Florence (FLR) is the closest and most convenient option to our wedding villa.
            </span>
          </div>
        </section>

        {/* 2 — Recommended booking window */}
        <section className={c.card}>
          <div className={c.cardHead}>
            <span className={c.cardIcon}>
              <UiIcon name="calendarCheck" size={22} />
            </span>
            <h2 className={c.cardTitle}>Recommended Booking Window</h2>
          </div>
          <p className={c.cardIntro}>
            Book your flights <strong>4&ndash;6 months in advance</strong> for the best prices
            and availability.
          </p>
          <div className={c.cardFill} aria-hidden="true">
            <UiIcon name="calendar" size={68} strokeWidth={1.4} />
          </div>
          <div className={c.callout}>
            <UiIcon name="info" size={16} className={c.calloutIcon} />
            <span className={c.calloutText}>
              Plan to arrive between <strong>Monday, June 16 &ndash; Wednesday, June 18</strong>.
              Our welcome events begin the afternoon of June 16.
            </span>
          </div>
        </section>

        {/* 3 — Ground transportation */}
        <section className={c.card}>
          <div className={c.cardHead}>
            <span className={c.cardIcon}>
              <UiIcon name="car" size={22} />
            </span>
            <h2 className={c.cardTitle}>Ground Transportation</h2>
          </div>
          <p className={c.cardIntro}>Once you arrive, here are the best ways to reach the villa:</p>
          <div className={c.list}>
            {TRANSPORT.map((t) => (
              <div key={t.title} className={c.rowItem}>
                <span className={c.rowText}>
                  <strong>{t.title}</strong>
                  <br />
                  {t.note}
                </span>
                <UiIcon name="chevron" size={16} className={c.rowChevron} />
              </div>
            ))}
          </div>
        </section>

        {/* 4 — Travel tips */}
        <section className={c.card}>
          <div className={c.cardHead}>
            <span className={c.cardIcon}>
              <UiIcon name="bulb" size={22} />
            </span>
            <h2 className={c.cardTitle}>Travel Tips</h2>
          </div>
          {TIPS.map((t) => (
            <div key={t.title} className={c.tip}>
              <UiIcon name={t.icon} size={20} className={c.tipIcon} />
              <span>
                <span className={c.tipTitle}>{t.title}</span>
                <br />
                <span className={c.tipBody}>{t.body}</span>
              </span>
            </div>
          ))}
        </section>

        {/* 5 — Share your travel plans (blue box, deferred submission) */}
        <section className={c.blueBox}>
          <ScallopFrame color="var(--color-sky-blue)" />
          <Illustration name="heart" tone="terracotta" size={24} />
          <h2 className={c.blueHeading}>Share Your Travel Plans</h2>
          <p className={c.blueBody}>
            Let us know your flight details so we can plan your arrival and any transportation
            needs!
          </p>
          <button type="button" className="btn-blue" disabled title="Available soon">
            Add Your Travel Info
          </button>
          <span className={c.blueBody} style={{ fontSize: 11, marginTop: 4 }}>
            (Coming soon &mdash; you&rsquo;ll be able to add this once RSVPs open.)
          </span>
        </section>

        {/* 6 — Questions */}
        <section className={c.card}>
          <div className={c.cardHead}>
            <span className={c.cardIcon}>
              <Illustration name="oliveBranch" size={24} />
            </span>
            <h2 className={c.cardTitle}>Questions?</h2>
          </div>
          <p className={c.cardIntro}>
            Check out our FAQ or reach out if you need any help planning your trip.
          </p>
          <div className={c.cardFill} aria-hidden="true">
            <Illustration name="lemonBranch" size={92} />
          </div>
          <a href="/faq" className="btn-outline" style={{ alignSelf: "flex-start" }}>
            View FAQ
          </a>
        </section>
      </div>
    </ContentPageFrame>
  );
}
