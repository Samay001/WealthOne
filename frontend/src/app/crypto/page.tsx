import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table-crypto";

// Define types for the metrics
interface PortfolioMetrics {
  totalBalance: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercentage: number;
}

// Define type for the change prop in MetricsCard
interface MetricChange {
  value: string;
  percentage: string;
  isPositive: boolean;
}

export default function CryptoDashboard() {
  // Set up state to store metrics with proper type annotation
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalBalance: 0,
    totalInvested: 0,
    totalReturn: 0,
    totalReturnPercentage: 0
  });

  // Type the metrics parameter in the callback
  const handleMetricsUpdate = useCallback((metrics: PortfolioMetrics) => {
    setPortfolioMetrics(metrics);
  }, []);

  // Add return type annotation to formatCurrency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className="w-full">
        <main className="p-6 bg-black text-white w-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Crypto Overview</h1>
              <div className="text-sm text-white/50">
                Aug 13, 2023 - Aug 18, 2023
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Crypto Value"
              value={formatCurrency(portfolioMetrics.totalBalance)}
              change={{
                value: formatCurrency(portfolioMetrics.totalReturn),
                percentage: `${portfolioMetrics.totalReturnPercentage > 0 ? '+' : ''}${portfolioMetrics.totalReturnPercentage.toFixed(2)}%`,
                isPositive: portfolioMetrics.totalReturn >= 0
              } as MetricChange}
            />
            <MetricsCard
              title="Investment"
              value={formatCurrency(portfolioMetrics.totalInvested)}
              change={{
                value: "",
                percentage: "",
              } as MetricChange}
            />
            <MetricsCard
              title="Return"
              value={formatCurrency(portfolioMetrics.totalReturn)}
              change={{
                value: "",
                percentage: `${portfolioMetrics.totalReturnPercentage > 0 ? '+' : ''}${portfolioMetrics.totalReturnPercentage.toFixed(2)}%`,
                isPositive: portfolioMetrics.totalReturn >= 0
              } as MetricChange}
            />
          </div>
          <Card className="mt-6 p-6 bg-[#09090B] border-white/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                General Statistics
              </h2>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-white">
                  Monthly
                </Button>
              </div>
            </div>
            <StatsChart />
          </Card>
          <div className="mt-6">
            {/* Pass the stable callback function to VaultTable */}
            <VaultTable onMetricsUpdate={handleMetricsUpdate} />
          </div>
        </main>
      </div>
    </div>
  );
}