import styles from "./AdminNav.module.css";
import AdminSidebarNav from "./AdminSidebarNav";
import LogoutButton from "./LogoutButton";
import Postmark from "@/components/admin/Postmark";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.wordmark}>
          <p className={styles.wordmarkNames}>Kelsey &amp; Andrew</p>
          <p className={styles.wordmarkEyebrow}>Umbria 2028</p>
        </div>
        <AdminSidebarNav />
        <div className={styles.sidebarFooter}>
          <div className={styles.postmark}>
            <Postmark size={92} />
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
