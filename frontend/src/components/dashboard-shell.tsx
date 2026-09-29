"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Bitcoin,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/stocks", label: "Stocks", icon: ChartNoAxesCombined },
  { href: "/crypto", label: "Crypto", icon: Bitcoin },
];

function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="WealthOne home">
      <div className="grid size-10 place-items-center rounded-[14px] bg-[#60a5fa] text-[#00031c] shadow-[0_8px_30px_rgba(59,130,246,0.22)] transition-transform group-hover:-rotate-3">
        <span className="text-lg font-black tracking-[-0.1em]">W1</span>
      </div>
      <div>
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">WealthOne</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.19em] text-white/35">Private wealth</p>
      </div>
    </Link>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { auth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = auth.user?.username || "Investor";

  return (
    <div className="min-h-screen bg-[#00031c] text-[#f4f7ff] selection:bg-[#60a5fa] selection:text-[#00031c]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-80 [background-image:radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_92%_12%,rgba(99,102,241,0.13),transparent_26%)]" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-blue-200/[0.09] bg-[#050a20]/95 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
        <Brand />

        <nav className="mt-12 space-y-1.5" aria-label="Dashboard navigation">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">Workspace</p>
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-[#3b82f6] text-white shadow-[0_8px_24px_rgba(59,130,246,0.22)]"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                )}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-5 overflow-hidden rounded-2xl border border-[#60a5fa]/20 bg-[#3b82f6]/[0.08] p-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="grid size-8 place-items-center rounded-full bg-[#60a5fa]/15 text-[#60a5fa]">
                <Sparkles className="size-4" />
              </div>
              <ArrowUpRight className="size-4 text-white/25" />
            </div>
            <p className="text-sm font-medium text-white">Need a second opinion?</p>
            <p className="mt-1 text-xs leading-5 text-white/40">Ask the AI advisor about risk, allocation, or a holding.</p>
          </div>

          <div className="flex items-center gap-3 border-t border-white/[0.07] pt-5">
            <div className="grid size-9 place-items-center rounded-full bg-[#a78bfa] text-xs font-bold text-[#130e21]">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs text-white/30">Personal account</p>
            </div>
            <button onClick={logout} className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.06] hover:text-white" aria-label="Log out">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-blue-200/[0.09] bg-[#00031c]/90 px-4 backdrop-blur-xl lg:hidden">
        <Brand />
        <button onClick={() => setMenuOpen((open) => !open)} className="grid size-10 place-items-center rounded-xl border border-white/10 text-white" aria-label="Toggle navigation">
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {menuOpen ? (
        <div className="fixed inset-x-3 top-[76px] z-50 rounded-2xl border border-white/10 bg-[#0f172a] p-2 shadow-2xl lg:hidden">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm", pathname === item.href ? "bg-[#3b82f6] text-white" : "text-white/60")}>
                <Icon className="size-4" /> {item.label}
              </Link>
            );
          })}
        </div>
      ) : null}

      <main className="relative z-10 lg:pl-[250px]">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
