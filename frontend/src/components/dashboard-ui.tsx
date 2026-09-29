"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type TooltipEntry = {
  color?: string;
  dataKey?: string | number;
  fill?: string;
  name?: string;
  value?: number | string;
  payload?: { color?: string; name?: string };
};

export function DashboardChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const title = label || payload[0]?.payload?.name || payload[0]?.name;

  return (
    <div className="min-w-[132px] rounded-xl border border-blue-200/15 bg-[#111a33] px-3 py-2.5 text-[#f4f7ff] shadow-[0_16px_40px_rgba(0,0,0,.45)]">
      {title ? <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50">{title}</p> : null}
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div key={`${String(item.dataKey || item.name)}-${index}`} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-white/60">
              <span className="size-1.5 rounded-full" style={{ background: item.color || item.fill || item.payload?.color || "#60a5fa" }} />
              {label ? item.name : "Value"}
            </span>
            <span className="font-semibold text-white">{formatCurrency(Number(item.value || 0))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const formatCurrency = (value: number, compact = false) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  if (compact) {
    const absolute = Math.abs(safeValue);
    const sign = safeValue < 0 ? "−" : "";
    if (absolute >= 10_000_000) return `${sign}₹${(absolute / 10_000_000).toFixed(1)}Cr`;
    if (absolute >= 100_000) return `${sign}₹${(absolute / 100_000).toFixed(1)}L`;
    if (absolute >= 1_000) return `${sign}₹${(absolute / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeValue);
};

export const formatPercent = (value: number) => `${Math.abs(value || 0).toFixed(2)}%`;

export function ReturnBadge({ value, suffix = "all time", className }: { value: number; suffix?: string; className?: string }) {
  const positive = value > 0;
  const neutral = value === 0 || !Number.isFinite(value);
  const Icon = neutral ? Minus : positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold", neutral ? "bg-white/[0.06] text-white/45" : positive ? "bg-[#5ee9a5]/10 text-[#72efb1]" : "bg-[#ff6b7a]/10 text-[#ff8792]", className)}>
      <Icon className="size-3" /> {neutral ? "0.00%" : formatPercent(value)} <span className="font-normal opacity-60">{suffix}</span>
    </span>
  );
}

export function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-[22px] border border-blue-200/[0.09] bg-[#0f172a]/90 shadow-[0_18px_60px_rgba(0,0,0,0.2)]", className)}>{children}</section>;
}

export function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#60a5fa]/85">
          <span className="size-1.5 rounded-full bg-[#60a5fa] shadow-[0_0_12px_#60a5fa]" /> {eyebrow}
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-[38px] sm:leading-tight">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function RefreshButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#3b82f6] px-4 text-xs font-semibold text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60">
      <svg className={cn("size-3.5", loading && "animate-spin")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 12a8 8 0 1 1-2.34-5.66L20 8"/><path d="M20 3v5h-5"/></svg>
      {loading ? "Syncing" : "Refresh data"}
    </button>
  );
}
