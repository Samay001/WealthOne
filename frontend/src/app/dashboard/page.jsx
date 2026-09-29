"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ChartPie, CircleDollarSign, Clock3, Landmark, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useCrypto } from "../context/cryptoContext";
import { useStock } from "../context/stockContext";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeading, RefreshButton, ReturnBadge, SectionCard, formatCurrency } from "@/components/dashboard-ui";

const allocationColors = ["#c8ff62", "#a78bfa"];

export default function DashboardPage() {
  const { isLoading: cryptoLoading, error: cryptoError, fetchCmpData, getCryptoData } = useCrypto();
  const { loading: stockLoading, error: stockError, lastUpdated, fetchAllCmpPrices, getStockData } = useStock();
  const stocks = getStockData();
  const crypto = getCryptoData();
  const holdings = [...stocks.map((item) => ({ ...item, assetClass: "Stock" })), ...crypto.map((item) => ({ ...item, assetClass: "Crypto", symbol: item.symbol.replace("INR", "") }))];
  const invested = holdings.reduce((sum, item) => sum + (item.investment || 0), 0);
  const current = holdings.reduce((sum, item) => sum + (item.currentValue ?? item.investment ?? 0), 0);
  const returns = current - invested;
  const returnPercent = invested ? (returns / invested) * 100 : 0;
  const stockValue = stocks.reduce((sum, item) => sum + (item.currentValue ?? item.investment ?? 0), 0);
  const cryptoValue = crypto.reduce((sum, item) => sum + (item.currentValue ?? item.investment ?? 0), 0);
  const allocation = [{ name: "Stocks", value: stockValue }, { name: "Crypto", value: cryptoValue }];
  const largestHolding = holdings.reduce((largest, item) => ((item.currentValue ?? item.investment ?? 0) > (largest?.currentValue ?? largest?.investment ?? 0) ? item : largest), holdings[0]);
  const loading = stockLoading || cryptoLoading;

  const refresh = async () => {
    await Promise.allSettled([fetchAllCmpPrices(), fetchCmpData()]);
  };

  return (
    <DashboardShell>
      <PageHeading eyebrow="Portfolio overview" title="Your wealth, in one place." description="A focused view of your positions, allocation, and portfolio health across Indian equities and digital assets." actions={<RefreshButton onClick={refresh} loading={loading} />} />

      {(stockError || cryptoError) ? <div className="mb-5 rounded-2xl border border-[#ff8792]/20 bg-[#ff8792]/[0.06] px-4 py-3 text-xs text-[#ffacb4]">Some live prices could not be updated. Last available purchase values are shown where needed.</div> : null}

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <section className="relative min-h-[310px] overflow-hidden rounded-[26px] border border-[#c8ff62]/15 bg-[#c8ff62] p-6 text-[#0a120f] sm:p-8">
          <div className="absolute -right-24 -top-28 size-[340px] rounded-full border-[55px] border-[#0a120f]/[0.055]" />
          <div className="absolute bottom-0 right-0 h-32 w-1/2 opacity-20 [background-image:linear-gradient(135deg,transparent_25%,#07100d_25%,#07100d_28%,transparent_28%,transparent_50%,#07100d_50%,#07100d_53%,transparent_53%,transparent_75%,#07100d_75%,#07100d_78%,transparent_78%)] [background-size:24px_24px]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a120f]/55">Total portfolio value</p><p className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">{formatCurrency(current)}</p></div><div className="grid size-11 place-items-center rounded-2xl bg-[#0a120f] text-[#c8ff62]"><WalletCards className="size-5" /></div></div>
            <div className="mt-16 flex flex-wrap items-end justify-between gap-5"><div><ReturnBadge value={returnPercent} suffix="total return" className="bg-[#0a120f] text-[#c8ff62]" /><p className="mt-3 text-sm text-[#0a120f]/55">{returns >= 0 ? "+" : "−"}{formatCurrency(Math.abs(returns))} on {formatCurrency(invested)} invested</p></div><div className="text-right"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0a120f]/45">Assets tracked</p><p className="mt-1 text-2xl font-semibold">{holdings.length}</p></div></div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <SectionCard className="p-5"><div className="flex items-center justify-between"><div className="grid size-9 place-items-center rounded-xl bg-[#a78bfa]/10 text-[#b9a4ff]"><Landmark className="size-4" /></div><Link href="/stocks" className="text-xs text-white/35 transition hover:text-white">View stocks <ArrowRight className="ml-1 inline size-3" /></Link></div><p className="mt-6 text-xs font-medium text-white/38">Equity value</p><p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">{formatCurrency(stockValue)}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#a78bfa]" style={{ width: `${current ? (stockValue / current) * 100 : 0}%` }} /></div></SectionCard>
          <SectionCard className="p-5"><div className="flex items-center justify-between"><div className="grid size-9 place-items-center rounded-xl bg-[#ffbd5a]/10 text-[#ffc975]"><CircleDollarSign className="size-4" /></div><Link href="/crypto" className="text-xs text-white/35 transition hover:text-white">View crypto <ArrowRight className="ml-1 inline size-3" /></Link></div><p className="mt-6 text-xs font-medium text-white/38">Digital assets</p><p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">{formatCurrency(cryptoValue)}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#ffbd5a]" style={{ width: `${current ? (cryptoValue / current) * 100 : 0}%` }} /></div></SectionCard>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.35fr]">
        <SectionCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Asset allocation</p><p className="mt-1 text-xs text-white/35">Current portfolio mix</p></div><ChartPie className="size-4 text-white/25" /></div>
          <div className="mt-3 grid grid-cols-[1fr_112px] items-center gap-2"><div className="space-y-4">{allocation.map((item, index) => <div key={item.name}><div className="flex items-center gap-2 text-xs text-white/45"><span className="size-2 rounded-full" style={{ background: allocationColors[index] }} />{item.name}</div><div className="mt-1 flex items-baseline gap-2"><span className="text-lg font-semibold text-white">{current ? ((item.value / current) * 100).toFixed(1) : 0}%</span><span className="text-[10px] text-white/25">{formatCurrency(item.value, true)}</span></div></div>)}</div><div className="relative h-32"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={allocation} dataKey="value" innerRadius={39} outerRadius={57} paddingAngle={4} stroke="none">{allocation.map((entry, index) => <Cell key={entry.name} fill={allocationColors[index]} />)}</Pie><Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#111e19", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 11 }} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-[10px] font-medium text-white/35">MIX</div></div></div>
        </SectionCard>

        <SectionCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.065] px-5 py-5 sm:px-6"><div><p className="text-sm font-semibold text-white">Top holdings</p><p className="mt-1 text-xs text-white/35">Ranked by current value</p></div><BriefcaseBusiness className="size-4 text-white/25" /></div>
          <div className="divide-y divide-white/[0.055]">{[...holdings].sort((a, b) => (b.currentValue ?? b.investment ?? 0) - (a.currentValue ?? a.investment ?? 0)).slice(0, 4).map((item) => { const value = item.currentValue ?? item.investment ?? 0; const change = item.investment ? ((value - item.investment) / item.investment) * 100 : 0; return <div key={`${item.assetClass}-${item.symbol}`} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 transition hover:bg-white/[0.018] sm:px-6"><div className="flex min-w-0 items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-[10px] font-bold text-white/70">{item.symbol.slice(0, 3)}</div><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{item.name}</p><p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/28">{item.assetClass}</p></div></div><div className="text-right"><p className="text-sm font-medium text-white">{formatCurrency(value)}</p><p className={`mt-0.5 text-[10px] ${change >= 0 ? "text-[#72efb1]" : "text-[#ff8792]"}`}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</p></div></div>; })}</div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <SectionCard className="p-5"><ShieldCheck className="size-5 text-[#72efb1]" /><p className="mt-5 text-sm font-semibold text-white">Diversification check</p><p className="mt-2 text-xs leading-5 text-white/38">{largestHolding ? `${largestHolding.symbol.replace("INR", "")} is your largest tracked position. Review concentration as values move.` : "Add holdings to evaluate concentration."}</p></SectionCard>
        <SectionCard className="p-5"><Clock3 className="size-5 text-[#b9a4ff]" /><p className="mt-5 text-sm font-semibold text-white">Market data</p><p className="mt-2 text-xs leading-5 text-white/38">{lastUpdated ? `Equity prices synced ${new Date(lastUpdated).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}.` : "Live pricing syncs when the dashboard opens."}</p></SectionCard>
        <SectionCard className="border-[#c8ff62]/15 bg-[#c8ff62]/[0.055] p-5"><Sparkles className="size-5 text-[#c8ff62]" /><p className="mt-5 text-sm font-semibold text-white">AI wealth assistant</p><p className="mt-2 text-xs leading-5 text-white/38">Use the assistant to explore allocation, portfolio risk, and individual positions.</p></SectionCard>
      </div>
    </DashboardShell>
  );
}
