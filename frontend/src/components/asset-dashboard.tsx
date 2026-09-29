"use client";

import { Activity, ArrowDownRight, ArrowUpRight, CircleDollarSign, Layers3, RefreshCw, Scale, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardChartTooltip, PageHeading, RefreshButton, ReturnBadge, SectionCard, formatCurrency } from "@/components/dashboard-ui";

type Asset = {
  id?: string | number;
  name: string;
  symbol: string;
  quantity: string | number;
  price: string | number;
  cmp?: number | null;
  investment?: number;
  currentValue?: number | null;
  returnAmount?: number | null;
  returnPercentage?: number | null;
  hasCurrentData?: boolean;
};

type Props = {
  kind: "Stocks" | "Crypto";
  eyebrow: string;
  description: string;
  assets: Asset[];
  loading: boolean;
  error?: string | null;
  lastUpdated?: Date | null;
  onRefresh: () => void | Promise<void>;
  accent: string;
  secondary: string;
};

export function AssetDashboard({ kind, eyebrow, description, assets, loading, error, lastUpdated, onRefresh, accent, secondary }: Props) {
  const normalized = assets.map((asset) => {
    const symbol = asset.symbol.replace("INR", "");
    const investment = asset.investment ?? Number(asset.price) * Number(asset.quantity);
    const currentValue = asset.currentValue ?? investment;
    const returnAmount = currentValue - investment;
    const returnPercentage = investment ? (returnAmount / investment) * 100 : 0;
    return { ...asset, symbol, investment, currentValue, returnAmount, returnPercentage };
  });
  const invested = normalized.reduce((sum, item) => sum + item.investment, 0);
  const current = normalized.reduce((sum, item) => sum + item.currentValue, 0);
  const returns = current - invested;
  const returnPercent = invested ? (returns / invested) * 100 : 0;
  const best = [...normalized].sort((a, b) => b.returnPercentage - a.returnPercentage)[0];
  const liveCount = normalized.filter((asset) => asset.hasCurrentData).length;
  const allocation = normalized.map((asset, index) => ({ name: asset.symbol, value: asset.currentValue, color: index % 2 ? secondary : accent }));

  return (
    <DashboardShell>
      <PageHeading eyebrow={eyebrow} title={`${kind} portfolio`} description={description} actions={<RefreshButton onClick={onRefresh} loading={loading} />} />
      {error ? <div className="mb-5 rounded-2xl border border-[#ff8792]/20 bg-[#ff8792]/[0.06] px-4 py-3 text-xs text-[#ffacb4]">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SectionCard className="relative overflow-hidden p-5 sm:col-span-2">
          <div className="absolute right-0 top-0 h-full w-1.5" style={{ background: accent }} />
          <div className="flex items-center gap-2 text-xs text-white/38"><Wallet className="size-3.5" /> Current value</div>
          <p className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white">{formatCurrency(current)}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3"><ReturnBadge value={returnPercent} /><span className="text-xs text-white/32">{returns >= 0 ? "+" : "−"}{formatCurrency(Math.abs(returns))}</span></div>
        </SectionCard>
        <SectionCard className="p-5"><div className="flex items-center justify-between"><p className="text-xs text-white/38">Capital invested</p><CircleDollarSign className="size-4 text-white/20" /></div><p className="mt-7 text-2xl font-semibold text-white">{formatCurrency(invested)}</p><p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-white/25">Across {normalized.length} assets</p></SectionCard>
        <SectionCard className="p-5"><div className="flex items-center justify-between"><p className="text-xs text-white/38">Live coverage</p><Activity className="size-4" style={{ color: accent }} /></div><p className="mt-7 text-2xl font-semibold text-white">{liveCount}/{normalized.length}</p><p className="mt-2 truncate text-[10px] uppercase tracking-[0.15em] text-white/25">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Sync in progress"}</p></SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.8fr]">
        <SectionCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Value vs. cost</p><p className="mt-1 text-xs text-white/35">Position-level performance in INR</p></div><Scale className="size-4 text-white/25" /></div>
          <div className="mt-6 h-[260px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={normalized} barGap={4}><CartesianGrid vertical={false} stroke="rgba(255,255,255,.06)" /><XAxis dataKey="symbol" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.38)", fontSize: 10 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.25)", fontSize: 10 }} tickFormatter={(value) => formatCurrency(Number(value), true)} width={55} /><Tooltip content={<DashboardChartTooltip />} cursor={{ fill: "rgba(200,255,98,.045)" }} /><Bar dataKey="investment" name="Invested" fill="rgba(255,255,255,.16)" radius={[5, 5, 0, 0]} activeBar={{ fill: "rgba(255,255,255,.3)" }} /><Bar dataKey="currentValue" name="Current" fill={accent} radius={[5, 5, 0, 0]} activeBar={{ fill: secondary }} /></BarChart></ResponsiveContainer></div>
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Allocation</p><p className="mt-1 text-xs text-white/35">Share of {kind.toLowerCase()} value</p></div><Layers3 className="size-4 text-white/25" /></div>
          <div className="relative mx-auto mt-4 h-[210px] max-w-[240px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={allocation} dataKey="value" innerRadius={58} outerRadius={87} paddingAngle={3} stroke="none">{allocation.map((entry) => <Cell key={entry.name} fill={entry.color} opacity={0.62 + (allocation.indexOf(entry) * 0.1)} />)}</Pie><Tooltip content={<DashboardChartTooltip />} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-[10px] uppercase tracking-widest text-white/25">Positions</p><p className="mt-1 text-2xl font-semibold text-white">{normalized.length}</p></div></div></div>
          {best ? <div className="rounded-xl bg-white/[0.035] px-3 py-2.5 text-xs text-white/38"><span className="font-medium text-white/70">{best.symbol}</span> is currently the strongest position at <span style={{ color: best.returnPercentage >= 0 ? "#72efb1" : "#ff8792" }}>{best.returnPercentage >= 0 ? "+" : ""}{best.returnPercentage.toFixed(2)}%</span>.</div> : null}
        </SectionCard>
      </div>

      <SectionCard className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6"><div><p className="text-sm font-semibold text-white">All positions</p><p className="mt-1 text-xs text-white/35">Purchase data and latest available valuation</p></div><RefreshCw className={`size-4 text-white/25 ${loading ? "animate-spin" : ""}`} /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead><tr className="border-b border-white/[0.055] text-[10px] uppercase tracking-[0.14em] text-white/25"><th className="px-6 py-3 font-medium">Asset</th><th className="px-4 py-3 font-medium">Quantity</th><th className="px-4 py-3 font-medium">Avg. price</th><th className="px-4 py-3 font-medium">Current price</th><th className="px-4 py-3 font-medium">Market value</th><th className="px-6 py-3 text-right font-medium">Return</th></tr></thead>
            <tbody className="divide-y divide-white/[0.05]">{normalized.map((asset) => {
              const positive = asset.returnAmount >= 0;
              return <tr key={asset.id ?? asset.symbol} className="transition hover:bg-white/[0.018]"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl text-[10px] font-bold text-[#07100d]" style={{ background: accent }}>{asset.symbol.slice(0, 3)}</div><div><p className="text-sm font-medium text-white">{asset.symbol}</p><p className="mt-0.5 max-w-[180px] truncate text-[10px] text-white/30">{asset.name}</p></div></div></td><td className="px-4 py-4 text-xs text-white/55">{Number(asset.quantity).toLocaleString("en-IN")}</td><td className="px-4 py-4 text-xs text-white/55">{formatCurrency(Number(asset.price))}</td><td className="px-4 py-4 text-xs text-white/55">{asset.cmp ? formatCurrency(asset.cmp) : <span className="text-white/22">Pending</span>}</td><td className="px-4 py-4 text-sm font-medium text-white">{formatCurrency(asset.currentValue)}</td><td className="px-6 py-4 text-right"><span className={`inline-flex items-center gap-1 text-xs font-medium ${positive ? "text-[#72efb1]" : "text-[#ff8792]"}`}>{positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{asset.returnPercentage >= 0 ? "+" : ""}{asset.returnPercentage.toFixed(2)}%</span><p className="mt-1 text-[10px] text-white/25">{asset.returnAmount >= 0 ? "+" : "−"}{formatCurrency(Math.abs(asset.returnAmount))}</p></td></tr>;
            })}</tbody>
          </table>
        </div>
      </SectionCard>
    </DashboardShell>
  );
}
