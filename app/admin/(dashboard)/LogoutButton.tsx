"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "none",
        fontFamily: "var(--font-sans)",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--olive-muted)",
        padding: "9px 10px",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      Log Out
    </button>
  );
}
