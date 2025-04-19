"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table-crypto";
import { VaultProvider, useVault } from "@/app/context/cryptoContext";
import { useAuth } from "../context/AuthContext";

// Dashboard content that uses the context
const DashboardContent = () => {
  const { metrics, formatCurrency, getMetricChange } = useVault();
  const [username, setUsername] = useState<string | null>(null);
  const { auth } = useAuth();

  useEffect(() => { 
    if (auth && auth.user) {
      setUsername(auth.user.username);
    }
  }
  , [auth]);

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className="w-full">
        <main className="p-6 bg-black text-white w-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="space-y-1 mb-2">
                <h1 className="text-2xl font-bold text-white">Crypto Overview</h1>
              </div>
              <div className="text-sm text-white/50">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div>
              <h2>{username}</h2>
          </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Crypto Value"
              value={formatCurrency(metrics.totalBalance)}
              change={getMetricChange('totalBalance')}
            />
            <MetricsCard
              title="Investment"
              value={formatCurrency(metrics.totalInvested)}
              change={getMetricChange('totalInvested')}
            />
            <MetricsCard
              title="Return"
              value={formatCurrency(metrics.totalReturn)}
              change={getMetricChange('totalReturn')}
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
            {/* VaultTable now gets data from context */}
            <VaultTable />
          </div>
        </main>
      </div>
    </div>
  );
};

// Main Dashboard component with provider wrapper
export default function CryptoDashboard() {
  return (
    <VaultProvider>
      <DashboardContent />
    </VaultProvider>
  );
}