import type { Metadata } from "next";
import DolcePage, { dolce as d } from "@/components/mobileproto/DolcePage";

/*
 * MOBILE-NATIVE PROTOTYPE — Stay, "Dolce" art direction. Noindex.
 */

export const metadata: Metadata = {
  title: "Stay (Dolce) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const FACTS = ["Sleeps 50 guests", "25 rooms & suites", "Pool, gardens & terraces"];

const ROOMS = [
  { name: "Garden Rooms", desc: "A peaceful retreat surrounded by the villa's gardens.", count: "12 Rooms", photo: "/assets/photos/villa-lawn.jpg" },
  { name: "Olive Grove Rooms", desc: "Near the olive groves, with beautiful views.", count: "8 Rooms", photo: "/assets/photos/olive-hills.jpg" },
  { name: "Villa Suites", desc: "Spacious suites with separate seating areas.", count: "4 Suites", photo: "/assets/hero/valdorcia.jpg" },
  { name: "Family Suites", desc: "Ideal for families or groups with extra space.", count: "1 Suite", photo: "/assets/photos/cypress-drive.jpg" },
];

export default function StayMobilePage() {
  return (
    <DolcePage
      eyebrow="Where you'll stay"
      title="The Villa"
      subtitle="Our home for the week — exclusively ours, all week long."
      active="stay"
    >
      <section className={d.section}>
        <article className={d.imgCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/hero/villa-estate.jpg" alt="The villa estate in the Tuscan countryside" className={d.imgCardPhoto} />
          <div className={d.imgCardBody}>
            <p className={d.sectionLabel}>Tuscany, Italy</p>
            <h2 className={d.imgCardTitle}>Villa di Santa Lucia</h2>
            <p className={d.imgCardText}>
              We have exclusive use of the villa and all of its amenities for the whole week.
            </p>
            <div style={{ marginTop: 6 }}>
              {FACTS.map((f) => (
                <div key={f} className={d.row}>
                  <span className={d.rowText}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className={d.section}>
        <p className={d.sectionLabel}>Room categories</p>
        <h2 className={d.sectionTitle}>Where guests stay</h2>
        <div className={d.callout}>
          <span className={d.calloutText}>
            Room assignments are coordinated with the couple — we&rsquo;ll share yours closer to the week.
          </span>
        </div>
        <div style={{ marginTop: 14 }}>
          {ROOMS.map((r) => (
            <article key={r.name} className={d.imgCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.photo} alt="" className={d.imgCardPhoto} />
              <div className={d.imgCardBody}>
                <div className={d.imgCardTop}>
                  <h3 className={d.imgCardTitle}>{r.name}</h3>
                  <span className={d.imgCardMeta}>{r.count}</span>
                </div>
                <p className={d.imgCardText}>{r.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className={d.sign}>Benvenuti</p>
      <p className={d.signSub}>Welcome</p>
    </DolcePage>
  );
}
