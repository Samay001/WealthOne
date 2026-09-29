"use client";

import { AssetDashboard } from "@/components/asset-dashboard";
import { useCrypto } from "@/app/context/cryptoContext";

export default function CryptoPage() {
  const { getCryptoData, isLoading, error, fetchCmpData } = useCrypto();
  return (
    <AssetDashboard
      kind="Crypto"
      eyebrow="Digital assets"
      description="Monitor your higher-volatility positions with a clear view of exposure and performance."
      assets={getCryptoData()}
      loading={isLoading}
      error={error}
      onRefresh={fetchCmpData}
      accent="#ffbd5a"
      secondary="#c8ff62"
    />
  );
}

