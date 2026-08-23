"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminNav.module.css";
import {
  IconHome,
  IconUsers,
  IconStore,
  IconWallet,
  IconCalendar,
  IconScale,
  IconDownload,
  IconSettings,
  IconPlane,
  IconBed,
  IconLeaf,
  IconMail,
} from "@/components/admin/icons";

/*
 * Grouped rather than a flat list of thirteen. The mockups show ten items and
 * no grouping, but they also predate Venues, Timeline, Decisions and Exports;
 * at this length an undivided list stops being scannable. Order within
 * "The weekend" follows the mockup.
 */
const NAV_GROUPS: {
  label: string | null;
  items: { label: string; href: string; Icon: typeof IconHome }[];
}[] = [
  {
    label: null,
    items: [{ label: "Dashboard", href: "/admin", Icon: IconHome }],
  },
  {
    label: "Guests",
    items: [
      { label: "Guest List", href: "/admin/guests", Icon: IconUsers },
      { label: "Travel", href: "/admin/travel", Icon: IconPlane },
      { label: "Lodging", href: "/admin/lodging", Icon: IconBed },
      { label: "Communications", href: "/admin/communications", Icon: IconMail },
    ],
  },
  {
    label: "The weekend",
    items: [
      { label: "Itinerary", href: "/admin/itinerary", Icon: IconCalendar },
      { label: "Activities", href: "/admin/activities", Icon: IconLeaf },
    ],
  },
  {
    label: "Planning",
    items: [
      { label: "Vendors", href: "/admin/vendors", Icon: IconStore },
      { label: "Budget", href: "/admin/budget", Icon: IconWallet },
      { label: "Timeline", href: "/admin/timeline", Icon: IconCalendar },
      { label: "Decisions", href: "/admin/decisions", Icon: IconScale },
    ],
  },
  {
    label: null,
    items: [
      { label: "Exports", href: "/admin/exports", Icon: IconDownload },
      { label: "Settings", href: "/admin/settings", Icon: IconSettings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Admin sections">
      {NAV_GROUPS.map((group, i) => (
        <div className={styles.navGroup} key={group.label ?? `group-${i}`}>
          {group.label && <p className={styles.navGroupLabel}>{group.label}</p>}
          <ul className={styles.navList}>
            {group.items.map(({ label, href, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                    }
                  >
                    <Icon size={15} className={styles.navIcon} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
