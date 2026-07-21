"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminNav.module.css";
import {
  IconHome,
  IconUsers,
  IconBuilding,
  IconStore,
  IconWallet,
  IconCalendar,
  IconScale,
  IconDownload,
} from "@/components/admin/icons";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", Icon: IconHome },
  { label: "Guest List", href: "/admin/guests", Icon: IconUsers },
  { label: "Venues", href: "/admin/venues", Icon: IconBuilding },
  { label: "Vendors", href: "/admin/vendors", Icon: IconStore },
  { label: "Budget", href: "/admin/budget", Icon: IconWallet },
  { label: "Timeline", href: "/admin/timeline", Icon: IconCalendar },
  { label: "Decisions", href: "/admin/decisions", Icon: IconScale },
  { label: "Exports", href: "/admin/exports", Icon: IconDownload },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <ul className={styles.nav}>
      {NAV_ITEMS.map(({ label, href, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
            >
              <Icon size={15} className={styles.navIcon} />
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
