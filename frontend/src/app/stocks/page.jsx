"use client";

import { AssetDashboard } from "@/components/asset-dashboard";
import { useStock } from "@/app/context/stockContext";

export default function StocksPage() {
  const { getStockData, loading, error, lastUpdated, fetchAllCmpPrices } = useStock();
  return (
    <AssetDashboard
      kind="Stocks"
      eyebrow="Indian equities"
      description="Track cost basis, current value, and return across your NSE-listed positions."
      assets={getStockData()}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={fetchAllCmpPrices}
      accent="#a78bfa"
      secondary="#60a5fa"
    />
  );
}
