import type { Metadata } from "next";
import Illustration from "@/components/Illustration";
import ScallopFrame from "@/components/ScallopFrame";
import { siteContent } from "@/data/siteContent";
import styles from "./home-preview-2.module.css";

/*
 * PROTOTYPE v2 — the "combined" direction (2026-07-22): editorial-scrapbook
 * foundation (warm textured paper, travel-journal motifs, handwriting, a taped
 * polaroid, an airmail rule) with the whimsical colour as accents (scalloped
 * colour card, saturated palette), dialled roughly 75% calm / 25% pop.
 * Noindex, standalone route. Illustrations intentionally minimal for now.
 */

export const metadata: Metadata = {
  title: "Home (Preview 2) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const ICONS: Record<string, React.ReactNode> = {
  Home: <path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />,
  "Our Weekend": (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16M8 4v3M16 4v3" strokeLinecap="round" />
    </>
  ),
  Travel: (
    <>
      <path d="M12 21c4-3.6 6.5-6.6 6.5-10a6.5 6.5 0 1 0-13 0c0 3.4 2.5 6.4 6.5 10Z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.4" />
    </>
  ),
  Stay: <path d="M3 18v-6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v5M3 14h18M21 18v-4" strokeLinecap="round" strokeLinejoin="round" />,
  Activities: <path d="M8 4h8l-1 6a3 3 0 0 1-6 0L8 4ZM12 13v5M9 21h6" strokeLinecap="round" strokeLinejoin="round" />,
  FAQ: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4 2c0 1.6-2 1.9-2 3.2M12 17.5h.01" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

function RoundStamp() {
  return (
    <svg viewBox="0 0 100 100" className={styles.stampSvg}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1 4.4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" />
      <path id="st2Top" d="M20 50a30 30 0 0 1 60 0" fill="none" />
      <path id="st2Bot" d="M20 50a30 30 0 0 0 60 0" fill="none" />
      <text className={styles.stampText}>
        <textPath href="#st2Top" startOffset="50%" textAnchor="middle">TUSCANY</textPath>
      </text>
      <text className={styles.stampText}>
        <textPath href="#st2Bot" startOffset="50%" textAnchor="middle">ITALIA</textPath>
      </text>
      <path d="M50 44c-3-4-9-1-9 3 0 3 5 6 9 9 4-3 9-6 9-9 0-4-6-7-9-3Z" fill="currentColor" />
    </svg>
  );
}

export default function HomePreview2Page() {
  const { couple, wedding } = siteContent;
  const nav = [{ label: "Home", href: "/" }, ...siteContent.navigation];

  return (
    <div className={styles.shell}>
      {/* Faint paper grain over everything. */}
      <div className={styles.grain} aria-hidden="true" />

      {/* ---------- Sidebar ---------- */}
      <aside className={styles.sidebar}>
        <span className={styles.seal} aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path id="seal2Top" d="M25 60a35 35 0 0 1 70 0" fill="none" />
            <path id="seal2Bot" d="M25 60a35 35 0 0 0 70 0" fill="none" />
            <text className={styles.sealText}>
              <textPath href="#seal2Top" startOffset="50%" textAnchor="middle">KELSEY &amp; ANDREW</textPath>
            </text>
            <text className={styles.sealText}>
              <textPath href="#seal2Bot" startOffset="50%" textAnchor="middle">TUSCANY 2027</textPath>
            </text>
          </svg>
          <span className={styles.sealArt}>
            <Illustration name="oliveBranch" tone="olive" size={30} />
          </span>
        </span>

        <nav className={styles.nav}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${item.label === "Home" ? styles.navActive : ""}`}
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                {ICONS[item.label] ?? ICONS.Home}
              </svg>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="/rsvp" className={styles.rsvpBtn}>
          RSVP / Login
        </a>
      </aside>

      {/* ---------- Main ---------- */}
      <main className={styles.main}>
        <div className={styles.hero}>
          {/* Left: the invitation type */}
          <div className={styles.inviteCol}>
            <p className={styles.pre}>Together with their families</p>
            <h1 className={styles.names}>
              <span className={styles.name}>{couple.bride}</span>
              <span className={styles.amp}>&amp;</span>
              <span className={styles.name}>{couple.groom}</span>
            </h1>
            <p className={styles.inviteLine}>invite you to celebrate their wedding</p>

            <p className={styles.date}>{wedding.dateLabel}</p>
            <p className={styles.loc}>{wedding.locationLabel}</p>
            <p className={styles.dolce}>la dolce vita</p>

            <a href="/rsvp" className={styles.cta}>
              RSVP &amp; Details
            </a>
          </div>

          {/* Right: a taped polaroid + stamp, scrapbook style */}
          <div className={styles.scrapCol}>
            <span className={styles.stamp} aria-hidden="true">
              <RoundStamp />
            </span>
            <figure className={styles.polaroid}>
              <span className={styles.tape} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero/split-rafael-peier.jpg"
                alt="A Tuscan farmhouse above olive groves and vineyard rows"
                className={styles.polaroidImg}
              />
              <figcaption className={styles.polaroidCap}>our home for the week</figcaption>
            </figure>
          </div>
        </div>

        {/* ---------- Postcard note + quick links ---------- */}
        <div className={styles.lower}>
          <div className={styles.postcard}>
            <ScallopFrame color="var(--sky-deep)" target={30} inset={7} />
            <p className={styles.postcardHi}>Ciao!</p>
            <p className={styles.postcardBody}>
              We can&rsquo;t wait to celebrate with you in Italy. Everything you need — travel,
              where to stay, the weekend plans — is right here.
            </p>
            <a href="/our-weekend" className={styles.postcardLink}>
              Start with the weekend <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <ul className={styles.links}>
            <li>
              <a href="/travel" className={styles.link}>
                <span className={styles.linkNum}>01</span>
                <span>
                  <span className={styles.linkLabel}>Travel</span>
                  <span className={styles.linkNote}>Flights, airports &amp; getting there</span>
                </span>
              </a>
            </li>
            <li>
              <a href="/stay" className={styles.link}>
                <span className={styles.linkNum}>02</span>
                <span>
                  <span className={styles.linkLabel}>Where You&rsquo;ll Stay</span>
                  <span className={styles.linkNote}>The villa &amp; room details</span>
                </span>
              </a>
            </li>
            <li>
              <a href="/our-weekend" className={styles.link}>
                <span className={styles.linkNum}>03</span>
                <span>
                  <span className={styles.linkLabel}>Weekend Schedule</span>
                  <span className={styles.linkNote}>Every event, welcome to farewell</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
