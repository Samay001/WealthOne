import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table";
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Wallet,
} from "lucide-react";

export default function CryptoDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/20 bg-black">
          <div className="flex h-16 items-center gap-2 border-b border-white/20 px-6">
            <Wallet className="h-6 w-6 text-white" />
            <span className="font-bold text-white">Wealth One</span>
          </div>
          <div className="px-4 py-4">
            <Input
              placeholder="Search"
              className="bg-black text-white border-white/20"
            />
          </div>
          <nav className="space-y-2 px-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white]"
            >
              <LayoutDashboard className="h-4 w-4 text-white" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white"
            >
              <BarChart3 className="h-4 w-4 text-white" />
              Stocks
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white"
            >
              <Globe className="h-4 w-4 text-white" />
              Crypto
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white"
            >
              <Home className="h-4 w-4 text-white" />
              Crypto Market
            </Button>
          </nav>
        </aside>
        <main className="p-6 bg-black text-white">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Overview</h1>
              <div className="text-sm text-white/50">
                Aug 13, 2023 - Aug 18, 2023
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2 bg-black text-white border-white/20"
            >
              Ethereum Network
              <ChevronDown className="h-4 w-4 text-white" />
            </Button>
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
