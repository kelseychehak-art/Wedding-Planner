import Link from "next/link";
import styles from "./AdminNav.module.css";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Guests", href: "/admin/guests" },
  { label: "Venues", href: "/admin/venues" },
  { label: "Budget", href: "/admin/budget" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <p className={styles.monogram}>K &amp; A</p>
        <ul className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <LogoutButton />
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
