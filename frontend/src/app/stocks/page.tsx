import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table";
import {
  ChevronDown,
} from "lucide-react";

export default function StockDashboard() {
  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className=" w-full">
        <main className="p-6 bg-black text-white w-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white"> Stocks Overview</h1>
              <div className="text-sm text-white/50">
                Aug 13, 2023 - Aug 18, 2023
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Your Balance"
              value="$74,892"
              change={{
                value: "$1,340",
                percentage: "-2.1%",
                isPositive: false,
              }}
            />
            <MetricsCard
              title="Your Deposits"
              value="$54,892"
              change={{
                value: "$1,340",
                percentage: "+13.2%",
                isPositive: true,
              }}
            />
            <MetricsCard
              title="Accrued Yield"
              value="$20,892"
              change={{
                value: "$1,340",
                percentage: "+1.2%",
                isPositive: true,
              }}
            />
          </div>
          <Card className="mt-6 p-6 bg-[#09090B] border-white/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                General Statistics
              </h2>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-white">
                  Today
                </Button>
                <Button size="sm" variant="ghost" className="text-white">
                  Last week
                </Button>
                <Button size="sm" variant="ghost" className="text-white">
                  Last month
                </Button>
                <Button size="sm" variant="ghost" className="text-white">
                  Last 6 months
                </Button>
                <Button size="sm" variant="ghost" className="text-white">
                  Year
                </Button>
              </div>
            </div>
            <StatsChart />
          </Card>
          <div className="mt-6">
            <VaultTable />
          </div>
        </main>
      </div>
    </div>
  );
}
