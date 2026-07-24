import type { Metadata } from "next";
import DolcePage, { dolce as d } from "@/components/mobileproto/DolcePage";

/*
 * MOBILE-NATIVE PROTOTYPE — Travel, "Dolce" art direction. Noindex.
 */

export const metadata: Metadata = {
  title: "Travel (Dolce) · Kelsey & Andrew",
  robots: { index: false, follow: false },
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
  { title: "Passport", body: "Valid for at least six months after your return date." },
  { title: "Travel Insurance", body: "Recommended for international trips — peace of mind is worth it." },
  { title: "Packing", body: "Comfortable shoes, sun protection, and layers for cooler evenings." },
  { title: "Connectivity", body: "Consider an international plan or an eSIM before you travel." },
];

export default function TravelMobilePage() {
  return (
    <DolcePage
      eyebrow="Getting there"
      title="Travel"
      subtitle="Flights, transfers, and a few tips for the journey to Tuscany."
      active="travel"
    >
      <section className={d.section}>
        <p className={d.sectionLabel}>Step one</p>
        <h2 className={d.sectionTitle}>Getting to Italy</h2>
        <p className={d.cardText} style={{ marginBottom: 12 }}>
          We recommend flying into one of these airports:
        </p>
        <div className={d.card}>
          {AIRPORTS.map((a) => (
            <div key={a.code} className={d.row}>
              <span className={d.rowLead}>{a.code}</span>
              <span className={d.rowText}>{a.city}</span>
            </div>
          ))}
        </div>
        <div className={d.callout}>
          <span className={d.calloutText}>
            <strong>Florence (FLR)</strong> is the closest and most convenient to our villa.
          </span>
        </div>
      </section>

      <section className={d.section}>
        <p className={d.sectionLabel}>Book early</p>
        <h2 className={d.sectionTitle}>When to book</h2>
        <div className={d.card}>
          <p className={d.cardText}>
            Book your flights <strong>4–6 months in advance</strong> for the best prices and
            availability.
          </p>
        </div>
        <div className={d.callout}>
          <span className={d.calloutText}>
            Plan to arrive <strong>Mon, June 16 – Wed, June 18</strong>. Our welcome events begin
            the afternoon of the 16th.
          </span>
        </div>
      </section>

      <section className={d.section}>
        <p className={d.sectionLabel}>On the ground</p>
        <h2 className={d.sectionTitle}>Getting to the villa</h2>
        <div className={d.card}>
          {TRANSPORT.map((t) => (
            <div key={t.title} className={d.row}>
              <span className={d.rowText}>
                <strong>{t.title}</strong>
                <br />
                <span className={d.rowNote}>{t.note}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={d.section}>
        <p className={d.sectionLabel}>Before you go</p>
        <h2 className={d.sectionTitle}>Good to know</h2>
        <div className={d.card}>
          {TIPS.map((t) => (
            <div key={t.title} className={d.row}>
              <span className={d.rowText}>
                <strong>{t.title}</strong>
                <br />
                <span className={d.rowNote}>{t.body}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <a href="/rsvp-mobile" className={d.cta}>
        RSVP &amp; Details
      </a>

      <p className={d.sign}>A presto</p>
      <p className={d.signSub}>See you soon</p>
    </DolcePage>
  );
}
