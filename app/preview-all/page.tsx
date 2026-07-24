import type { Metadata } from "next";
import styles from "./preview-all.module.css";

/*
 * PROTOTYPE HUB — one place to click through all three homepage directions,
 * each on mobile and desktop, with every tab. Noindex.
 */

export const metadata: Metadata = {
  title: "Prototype Hub · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

type Links = { label: string; href: string }[];

const VERSIONS: {
  name: string;
  blurb: string;
  accent: string;
  mobileHome: string;
  desktopHome: string;
  mobile: Links;
  desktop: Links;
}[] = [
  {
    name: "Framed",
    blurb: "Cream & editorial — a taped photo scrapbook. Blue / coral / lemon accents.",
    accent: "#6f9fce",
    mobileHome: "/home-dolce",
    desktopHome: "/home-dolce-desktop",
    mobile: [
      { label: "Weekend", href: "/our-weekend-mobile" },
      { label: "Travel", href: "/travel-mobile" },
      { label: "Stay", href: "/stay-mobile" },
      { label: "Activities", href: "/activities-mobile" },
      { label: "FAQ", href: "/faq-mobile" },
      { label: "RSVP", href: "/rsvp-mobile" },
    ],
    desktop: [
      { label: "Weekend", href: "/our-weekend-mobile" },
      { label: "Travel", href: "/travel-desktop" },
      { label: "Stay", href: "/stay-desktop" },
      { label: "Activities", href: "/activities-desktop" },
      { label: "FAQ", href: "/faq-desktop" },
      { label: "RSVP", href: "/rsvp-desktop" },
    ],
  },
  {
    name: "Fluid",
    blurb: "A photograph bleeds up into the cream, type layered above. Same cream tabs as Framed.",
    accent: "#d9702f",
    mobileHome: "/home-fluid?img=federico",
    desktopHome: "/home-fluid-desktop?img=federico",
    mobile: [
      { label: "Weekend", href: "/our-weekend-mobile" },
      { label: "Travel", href: "/travel-mobile" },
      { label: "Stay", href: "/stay-mobile" },
      { label: "Activities", href: "/activities-mobile" },
      { label: "FAQ", href: "/faq-mobile" },
      { label: "RSVP", href: "/rsvp-mobile" },
    ],
    desktop: [
      { label: "Weekend", href: "/our-weekend-mobile" },
      { label: "Travel", href: "/travel-desktop" },
      { label: "Stay", href: "/stay-desktop" },
      { label: "Activities", href: "/activities-desktop" },
      { label: "FAQ", href: "/faq-desktop" },
      { label: "RSVP", href: "/rsvp-desktop" },
    ],
  },
  {
    name: "Vintage",
    blurb: "A public-domain painting fills the hero and carries into the tabs. Terracotta / olive accents. ⭐",
    accent: "#cf7a52",
    mobileHome: "/home-vintage?art=vista",
    desktopHome: "/home-vintage-desktop?art=vista",
    mobile: [
      { label: "Weekend", href: "/our-weekend-vintage" },
      { label: "Travel", href: "/travel-vintage" },
      { label: "Stay", href: "/stay-vintage" },
      { label: "Activities", href: "/activities-vintage" },
      { label: "FAQ", href: "/faq-vintage" },
      { label: "RSVP", href: "/rsvp-vintage" },
    ],
    desktop: [
      { label: "Weekend", href: "/our-weekend-vintage-desktop" },
      { label: "Travel", href: "/travel-vintage-desktop" },
      { label: "Stay", href: "/stay-vintage-desktop" },
      { label: "Activities", href: "/activities-vintage-desktop" },
      { label: "FAQ", href: "/faq-vintage-desktop" },
      { label: "RSVP", href: "/rsvp-vintage-desktop" },
    ],
  },
];

export default function PreviewAllPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Prototype Hub</p>
        <h1 className={styles.title}>Three directions, two screens</h1>
        <p className={styles.sub}>
          Click through each version on both mobile and desktop. Tip: to feel the mobile ones,
          narrow your browser window or open them on your phone.
        </p>
      </header>

      <section className={styles.chosen}>
        <p className={styles.chosenLabel}>⭐ The site — Fluid homepage + Vintage tabs</p>
        <p className={styles.chosenBlurb}>
          Wired together as one experience: the photo-bleed homepage opens into the painting-headed
          tabs, and every link stays inside the set.
        </p>
        <div className={styles.chosenRow}>
          <a href="/home-fluid" className={styles.chosenBtn}>
            📱 Start — mobile
          </a>
          <a href="/home-fluid-desktop" className={styles.chosenBtn}>
            🖥 Start — desktop
          </a>
        </div>
      </section>

      <p className={styles.compareLabel}>Or compare the three original directions</p>

      <div className={styles.grid}>
        {VERSIONS.map((v) => (
          <section key={v.name} className={styles.card} style={{ "--accent": v.accent } as React.CSSProperties}>
            <h2 className={styles.cardTitle}>{v.name}</h2>
            <p className={styles.blurb}>{v.blurb}</p>

            <div className={styles.homeRow}>
              <a href={v.mobileHome} className={styles.homeBtn}>
                📱 Mobile home
              </a>
              <a href={v.desktopHome} className={styles.homeBtn}>
                🖥 Desktop home
              </a>
            </div>

            <div className={styles.tabsWrap}>
              <div className={styles.tabsCol}>
                <p className={styles.tabsLabel}>Mobile tabs</p>
                {v.mobile.map((t) => (
                  <a key={t.href} href={t.href} className={styles.tabLink}>
                    {t.label}
                  </a>
                ))}
              </div>
              <div className={styles.tabsCol}>
                <p className={styles.tabsLabel}>Desktop tabs</p>
                {v.desktop.map((t) => (
                  <a key={t.href + "d"} href={t.href} className={styles.tabLink}>
                    {t.label}
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <p className={styles.foot}>
        Notes: Framed &amp; Fluid share the same cream content tabs (only the homepage differs).
        Weekend pages through one day at a time on mobile, and shows the whole week on desktop.
      </p>
    </div>
  );
}
