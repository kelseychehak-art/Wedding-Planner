import type { Metadata } from "next";
import theme from "./admin-theme.module.css";

/*
 * The back-office is private. The proxy already redirects unauthenticated
 * requests to the login page, but the login page itself is reachable, so tell
 * crawlers not to index or follow anything under /admin.
 */
export const metadata: Metadata = {
  title: "Admin · Kelsey & Andrew",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // theme.theme remaps the palette to the guest brand for everything under /admin.
  return <div className={theme.theme}>{children}</div>;
}
