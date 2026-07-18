import type { Metadata } from "next";
import ContentPageFrame from "@/components/ContentPageFrame";
import Illustration from "@/components/Illustration";
import UiIcon from "@/components/UiIcon";
import ScallopFrame from "@/components/ScallopFrame";
import c from "@/components/gridCards.module.css";
import s from "./stay.module.css";

export const metadata: Metadata = {
  title: "Stay · Kelsey & Andrew's Wedding Week",
  description:
    "Room blocks and villa details for Kelsey & Andrew's wedding week in Tuscany, Italy — June 16–21, 2027.",
};

const ROOMS = [
  {
    name: "Garden Rooms",
    desc: "A peaceful retreat surrounded by the villa's gardens.",
    count: "12 Rooms",
    photo: "/assets/photos/villa-lawn.jpg",
  },
  {
    name: "Olive Grove Rooms",
    desc: "Located near the olive groves with beautiful views.",
    count: "8 Rooms",
    photo: "/assets/photos/olive-hills.jpg",
  },
  {
    name: "Villa Suites",
    desc: "Spacious suites with separate seating areas.",
    count: "4 Suites",
    photo: "/assets/hero/valdorcia.jpg",
  },
  {
    name: "Family Suites",
    desc: "Ideal for families or groups with extra space to relax.",
    count: "1 Suite",
    photo: "/assets/photos/cypress-drive.jpg",
  },
];

export default function StayPage() {
  return (
    <ContentPageFrame
      title="Browse Where You'll Stay"
      subtitle="Room blocks and details for our week in Italy."
      footerLine="We can't wait to welcome you to Italy!"
    >
      {/* Villa intro */}
      <div className={s.villa}>
        <div className={s.villaCard}>
          <p className={s.villaLabel}>The Villa</p>
          <h2 className={s.villaName}>Villa di Santa Lucia</h2>
          <p className={s.villaLoc}>Tuscany, Italy</p>
          <p className={s.villaIntro}>
            Our home for the week! We have exclusive use of the villa and all of its amenities.
          </p>
          <div className={s.facts}>
            <div className={s.fact}>
              <UiIcon name="bed" size={20} className={s.factIcon} />
              <span className={s.factText}>
                <strong>Sleeps 50 guests</strong>
              </span>
            </div>
            <div className={s.fact}>
              <UiIcon name="check" size={20} className={s.factIcon} />
              <span className={s.factText}>
                <strong>25 rooms &amp; suites</strong>
              </span>
            </div>
            <div className={s.fact}>
              <UiIcon name="sparkle" size={20} className={s.factIcon} />
              <span className={s.factText}>
                Pool, gardens, terraces &amp; multiple gathering spaces
              </span>
            </div>
          </div>
          <a href="/our-weekend" className={c.link}>
            View amenities &amp; photos →
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero/villa-estate.jpg"
          alt="The villa estate in the Tuscan countryside"
          className={s.villaPhoto}
        />
      </div>

      {/* Room categories */}
      <div className={c.blockGap}>
        <div className={c.sectionHead}>
          <Illustration name="key" size={24} />
          <h2 className={c.sectionTitle}>Room Categories</h2>
        </div>

        <div className={s.assignNote}>
          <UiIcon name="info" size={20} />
          <span className={s.assignText}>
            <strong>Room assignments are on the way.</strong> Once they&rsquo;re finalized,
            you&rsquo;ll be able to see exactly where you&rsquo;re staying right here on the site.
          </span>
        </div>

        <div className={s.rooms}>
          {ROOMS.map((r) => (
            <div key={r.name} className={s.roomCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.photo} alt="" className={s.roomPhoto} loading="lazy" />
              <div className={s.roomBody}>
                <p className={s.roomName}>{r.name}</p>
                <p className={s.roomDesc}>{r.desc}</p>
                <p className={s.roomCount}>{r.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policies + Questions + Share */}
      <div className={`${c.grid} ${c.blockGap}`}>
        <section className={c.card}>
          <div className={c.cardHead}>
            <span className={c.cardIcon}>
              <Illustration name="wineGlass" size={22} />
            </span>
            <h2 className={c.cardTitle}>Room Policies</h2>
          </div>
          <div className={s.policy}>
            <UiIcon name="check" size={18} className={s.policyIcon} />
            <span className={s.policyText}>
              <strong>Check-in:</strong> Mon, June 16 after 3:00 PM
            </span>
          </div>
          <div className={s.policy}>
            <UiIcon name="check" size={18} className={s.policyIcon} />
            <span className={s.policyText}>
              <strong>Check-out:</strong> Sat, June 21 by 11:00 AM
            </span>
          </div>
          <div className={s.policy}>
            <UiIcon name="check" size={18} className={s.policyIcon} />
            <span className={s.policyText}>Daily housekeeping included</span>
          </div>
          <div className={s.policy}>
            <UiIcon name="check" size={18} className={s.policyIcon} />
            <span className={s.policyText}>Special requests always welcome</span>
          </div>
        </section>

        <section
          className={c.card}
          style={{ padding: 0, border: "none", background: "transparent" }}
        >
          <div className={c.blueBox}>
            <ScallopFrame color="var(--color-sky-blue)" />
            <Illustration name="lemonBranch" size={44} />
            <h2 className={c.blueHeading}>Questions?</h2>
            <p className={c.blueBody}>
              If you have any questions about your room, the villa, or need special
              accommodations, we&rsquo;re here to help!
            </p>
            <a href="/faq" className="btn-blue">
              View FAQ
            </a>
          </div>
        </section>

        <section className={c.card}>
          <div className={c.cardHead}>
            <span className={c.cardIcon}>
              <Illustration name="bicycle" size={22} />
            </span>
            <h2 className={c.cardTitle}>Share Your Stay</h2>
          </div>
          <p className={c.cardIntro}>
            We&rsquo;d love to see your photos from the villa! Tag us and use our hashtag.
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--color-terracotta)",
              marginTop: "auto",
            }}
          >
            #ChehakShultsWedding
          </p>
        </section>
      </div>
    </ContentPageFrame>
  );
}
