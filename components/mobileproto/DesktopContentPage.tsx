import styles from "./DesktopContentPage.module.css";

/*
 * Shared desktop content-tab shell (prototype). Renders a top nav bar + header
 * + centered readable column. `variant="cream"` matches the mobile cream tabs
 * (blue eyebrows, plain header); `variant="vintage"` remaps accents to
 * terracotta and shows a painting header band (pass `art`). Nav links point at
 * the matching desktop variant set.
 */

type Variant = "cream" | "vintage";

const NAV: Record<Variant, { href: string; label: string; key: string }[]> = {
  cream: [
    { href: "/our-weekend-mobile", label: "Our Weekend", key: "weekend" },
    { href: "/travel-desktop", label: "Travel", key: "travel" },
    { href: "/stay-desktop", label: "Stay", key: "stay" },
    { href: "/activities-desktop", label: "Activities", key: "activities" },
    { href: "/faq-desktop", label: "FAQ", key: "faq" },
  ],
  vintage: [
    { href: "/our-weekend", label: "Our Weekend", key: "weekend" },
    { href: "/travel", label: "Travel", key: "travel" },
    { href: "/stay", label: "Stay", key: "stay" },
    { href: "/activities", label: "Activities", key: "activities" },
    { href: "/faq", label: "FAQ", key: "faq" },
  ],
};

const HOME: Record<Variant, string> = {
  cream: "/home-dolce-desktop",
  // The assembled, promoted site: Fluid homepage + Vintage tabs at their real routes.
  vintage: "/",
};
const RSVP: Record<Variant, string> = {
  cream: "/rsvp-desktop",
  vintage: "/rsvp",
};

export default function DesktopContentPage({
  variant = "cream",
  eyebrow,
  title,
  subtitle,
  subTone,
  titleTone,
  active = "",
  art,
  children,
}: {
  variant?: Variant;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Tint the subtitle (e.g. Weekend's date range) with the cornflower accent. */
  subTone?: "sea";
  titleTone?: "sea" | "coral";
  active?: string;
  art?: string;
  children: React.ReactNode;
}) {
  const subClass = `${styles.sub} ${subTone === "sea" ? styles.subSea : ""}`;
  const isVintage = variant === "vintage";
  const nav = NAV[variant];

  const topbar = (
    <header className={styles.topbar}>
      <a href={HOME[variant]} className={styles.brand}>
        K &amp; A
      </a>
      <nav className={styles.nav} aria-label="Primary">
        {nav.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className={`${styles.navLink} ${active && n.key === active ? styles.navActive : ""}`}
          >
            {n.label}
          </a>
        ))}
        <a href={RSVP[variant]} className={styles.navRsvp}>
          RSVP
        </a>
      </nav>
    </header>
  );

  return (
    <div className={`${styles.page} ${isVintage ? styles.vintage : ""}`}>
      {isVintage && art ? (
        <section className={styles.band} style={{ backgroundImage: `url(${art})` }}>
          {topbar}
          <div className={styles.bandText}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={subClass}>{subtitle}</p>}
          </div>
        </section>
      ) : (
        <>
          {topbar}
          <div className={styles.head}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h1 className={`${styles.title} ${titleTone === "coral" ? styles.titleCoral : ""}`}>
              {title}
            </h1>
            {subtitle && <p className={subClass}>{subtitle}</p>}
          </div>
        </>
      )}

      <main className={styles.body}>{children}</main>
    </div>
  );
}
