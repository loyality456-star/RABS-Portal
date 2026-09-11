"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cx } from "@/lib/format";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l9-8 9 8M5 10v10h14V10" },
  { href: "/products", label: "Products", icon: "M6 3h12l3 6-9 12L3 9l3-6ZM3 9h18M9 3l3 6 3-6" },
  { href: "/categories", label: "Categories", icon: "M4 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm8 11v-3a4 4 0 0 0-8 0v3M16 6a3 3 0 1 0 0 6M14 15v1a3 3 0 0 0 6 0v-1" },
  { href: "/reviews", label: "Reviews", icon: "M4 5h16v11H8l-4 4V5ZM8 9h8M8 12h5" },
  { href: "/orders", label: "Orders", icon: "M6 2v4M18 2v4M3 6h18v16H3V6ZM3 10h18" },
  { href: "/admins", label: "Admins", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" },
];

export default function PortalShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-outline-variant bg-surface-container-low transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-sm border-b border-outline-variant px-md">
          <Image
            src="/logo.png"
            alt="RABS logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-outline-variant"
          />
          <div>
            <p className="text-title-md text-on-surface">RABS Portal</p>
            <p className="text-label-sm text-on-surface-variant">Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-xs overflow-y-auto p-md">
          {NAV.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cx(
                  "flex items-center gap-sm rounded-[0.5rem] px-sm py-[10px] text-body-md transition-colors",
                  active
                    ? "bg-primary-container text-white shadow-elevation-low"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant p-md">
          <div className="mb-sm flex items-center gap-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container text-label-lg uppercase">
              {username.slice(0, 2)}
            </span>
            <span className="truncate text-title-md text-on-surface">{username}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="btn-secondary w-full !h-9 !text-label-md"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#13231A]/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-sm border-b border-outline-variant bg-surface/90 px-md backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-[0.5rem] border border-outline-variant text-on-surface-variant"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <span className="font-display text-title-lg text-on-surface">RABS Portal</span>
        </header>
        <main className="flex-1 p-md lg:p-2xl">{children}</main>
      </div>
    </div>
  );
}