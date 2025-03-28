import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MetricsCard } from "@/components/metrics-card";
import {PieComponent} from '@/components/pie-chart'
import { LineComponent } from "@/components/line-chart";
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

export default function Dashboard() {
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
          <div className="chart-theme flex mt-10 gap-17">
            <PieComponent/>
            <LineComponent/>
            <LineComponent/>
          </div>
        </main>
      </div>
    </div>
  );
}
