import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Illustration from "@/components/Illustration";
import { siteContent } from "@/data/siteContent";
import styles from "./not-found.module.css";

/*
 * Guest-facing 404. A mistyped or stale link is the most likely way a guest
 * meets an error page, so it stays in the brand and points back to the pages
 * they were probably after — never a bare "404".
 */
export const metadata = {
  title: `Page not found · ${siteContent.couple.displayName}`,
};

const SUGGESTIONS = [
  { label: "Our Weekend", href: "/our-weekend" },
  { label: "Travel", href: "/travel" },
  { label: "Stay", href: "/stay" },
  { label: "RSVP", href: "/rsvp" },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.panel}>
          <Illustration name="oliveBranch" size={56} className={styles.sprig} />
          <p className={styles.eyebrow}>Page not found</p>
          <h1 className={styles.heading}>We couldn&rsquo;t find that page</h1>
          <p className={styles.body}>
            The link may be out of date, or there might be a typo in the address. Everything about
            the weekend is still here — try one of these.
          </p>
          <ul className={styles.links}>
            {SUGGESTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className={styles.link}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/" className="btn-primary">
            Back to the beginning
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
