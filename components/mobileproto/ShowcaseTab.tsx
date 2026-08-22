import ShowcaseBottomNav from "./ShowcaseBottomNav";
import ShowcaseMenu from "./ShowcaseMenu";
import styles from "./ShowcaseTab.module.css";

/*
 * PREVIEW ONLY — generic tab shell in the new brand skin. Renders the swan
 * monogram (→ home), nav, a Gwendolyn title over the shared blurred-painting
 * background, then the page's real body (passed as children) re-skinned purely
 * via the CSS variables set on `.body`. Used by /showcase/{travel,stay,
 * activities,faq}. (Weekend has its own bespoke timeline component.)
 */

const NAV = [
  { key: "weekend", label: "Our Weekend", href: "/our-weekend" },
  { key: "travel", label: "Travel", href: "/travel" },
  { key: "stay", label: "Stay", href: "/stay" },
  { key: "activities", label: "Activities", href: "/activities" },
  { key: "faq", label: "FAQ", href: "/faq" },
];

export default function ShowcaseTab({
  title,
  subtitle,
  activeKey,
  children,
}: {
  title: string;
  subtitle?: string;
  activeKey?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <section className={styles.band}>
        <div className={styles.bandVeil} aria-hidden="true" />

        <header className={styles.topbar}>
          <a href="/" className={styles.brand} aria-label="Home">
            <span className={styles.brandSwan} aria-hidden="true" />
            <span className={styles.brandInitials}>K &amp; A</span>
          </a>
          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((n) => (
              <a
                key={n.key}
                href={n.href}
                className={`${styles.navLink} ${n.key === activeKey ? styles.navActive : ""}`}
              >
                {n.label}
              </a>
            ))}
            <a href="/rsvp" className={styles.navRsvp}>
              RSVP
            </a>
          </nav>
        </header>
        <ShowcaseMenu />

        <div className={styles.bandText}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.sub}>{subtitle}</p>}
        </div>
      </section>

      <main className={styles.body}>{children}</main>
      <ShowcaseBottomNav active={activeKey} />
    </div>
  );
}
