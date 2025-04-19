"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/metrics-card";
import CryptoDashboard from "@/app/crypto/page";
import StockDashboard from "@/app/stocks/page";
import Link from "next/link";
import {
  BarChart3,
  Globe,
  LayoutDashboard,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Hardcoded username
  const username = "John Doe";
  
  // Hardcoded metrics data
  const hardcodedMetrics = {
    totalBalance: "₹1,250,000.00",
    totalInvestment: "₹1,000,000.00",
    totalPnl: "₹250,000.00",
    totalPnlPercentage: "+25.00%",
    
    stocksBalance: "₹750,000.00",
    stocksInvestment: "₹600,000.00",
    stocksPnl: "₹150,000.00",
    stocksPnlPercentage: "+25.00%",
    
    cryptoBalance: "₹500,000.00",
    cryptoInvestment: "₹400,000.00",
    cryptoPnl: "₹100,000.00",
    cryptoPnlPercentage: "+25.00%",
  };
  
  // Hardcoded top holdings
  const topHoldings = [
    { name: "AAPL", type: "stock", price: 175.25, value: 175250, pnl: 45250, pnlPercentage: 34.8 },
    { name: "MSFT", type: "stock", price: 350.45, value: 140180, pnl: 30180, pnlPercentage: 27.4 },
    { name: "BTC", type: "crypto", price: 65000, value: 130000, pnl: 50000, pnlPercentage: 62.5 },
    { name: "AMZN", type: "stock", price: 178.30, value: 89150, pnl: 19150, pnlPercentage: 27.4 },
    { name: "ETH", type: "crypto", price: 3400, value: 68000, pnl: 18000, pnlPercentage: 36.0 }
  ];
  
  // Hardcoded loading state
  const loading = false;
  
  // Format currency function
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <main className="p-6 bg-black text-white w-full min-h-screen">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="space-y-1 mb-2">
                  <h1 className="text-2xl font-bold text-white">Overview</h1>
                </div>
                <div className="text-sm text-white/50">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div>
                <h2>{username}</h2>
              </div>
            </div>

            {/* Metrics Cards Section */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {loading ? (
                <>
                  <Skeleton className="h-32 rounded-lg bg-white/10" />
                  <Skeleton className="h-32 rounded-lg bg-white/10" />
                  <Skeleton className="h-32 rounded-lg bg-white/10" />
                </>
              ) : (
                <>
                  <MetricsCard
                    title="Your Balance"
                    value={hardcodedMetrics.totalBalance}
                    change={{
                      value: hardcodedMetrics.totalPnl,
                      percentage: hardcodedMetrics.totalPnlPercentage,
                      isPositive: true,
                    }}
                  />
                  <MetricsCard
                    title="Your Investments"
                    value={hardcodedMetrics.totalInvestment}
                    change={{
                      value: "",
                      percentage: "",
                      isPositive: true,
                    }}
                  />
                  <MetricsCard
                    title="Total Returns"
                    value={hardcodedMetrics.totalPnl}
                    change={{
                      value: "",
                      percentage: hardcodedMetrics.totalPnlPercentage,
                      isPositive: true,
                    }}
                  />
                </>
              )}
            </div>

            {/* Asset Allocation Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-32 rounded-lg bg-white/10" />
                  <Skeleton className="h-32 rounded-lg bg-white/10" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Stocks</h3>
                    <div className="flex justify-between mb-1">
                      <span>Value:</span>
                      <span>{hardcodedMetrics.stocksBalance}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Investment:</span>
                      <span>{hardcodedMetrics.stocksInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return:</span>
                      <span className="text-green-500">
                        {hardcodedMetrics.stocksPnl} ({hardcodedMetrics.stocksPnlPercentage})
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Crypto</h3>
                    <div className="flex justify-between mb-1">
                      <span>Value:</span>
                      <span>{hardcodedMetrics.cryptoBalance}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Investment:</span>
                      <span>{hardcodedMetrics.cryptoInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return:</span>
                      <span className="text-green-500">
                        {hardcodedMetrics.cryptoPnl} ({hardcodedMetrics.cryptoPnlPercentage})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Charts Section */}
            <div className="chart-theme flex flex-col md:flex-row gap-4 w-full">
              <div className="w-full min-h-[300px]">
                {loading ? (
                  <Skeleton className="h-64 rounded-lg bg-white/10" />
                ) : (
                  <div className="bg-white/5 p-4 rounded-lg h-full">
                    <h3 className="text-lg font-medium mb-4">Top Holdings</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left pb-2">Asset</th>
                            <th className="text-right pb-2">Type</th>
                            <th className="text-right pb-2">Price</th>
                            <th className="text-right pb-2">Value</th>
                            <th className="text-right pb-2">Return</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topHoldings.map((holding, index) => (
                            <tr key={index} className="border-t border-white/10">
                              <td className="py-2">{holding.name}</td>
                              <td className="text-right py-2 capitalize">{holding.type}</td>
                              <td className="text-right py-2">{formatCurrency(holding.price)}</td>
                              <td className="text-right py-2">{formatCurrency(holding.value)}</td>
                              <td className={`text-right py-2 ${holding.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {formatCurrency(holding.pnl)} ({holding.pnlPercentage.toFixed(2)}%)
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        );
      case "stocks":
        return <StockDashboard />;
      case "crypto":
        return <CryptoDashboard />;
      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between h-16 border-b border-white/20 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-white" />
            <span className="font-bold text-white">Wealth One</span>
          </div>
        </Link>
        <Button variant="ghost" onClick={toggleSidebar} className="text-white">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar - responsive */}
        <aside className={`${sidebarOpen ? "fixed inset-0 z-50 bg-black" : "hidden"} lg:relative lg:block border-r border-white/20 bg-black`}>
          <Link href="/" className="flex items-center gap-2">
            <div className="hidden lg:flex h-16 items-center gap-2 border-b border-white/20 px-6">
              <Wallet className="h-6 w-6 text-white" />
              <span className="font-bold text-white">Wealth One</span>
            </div>
          </Link>
          {sidebarOpen && (
            <div className="flex lg:hidden items-center justify-end p-4">
              <Button variant="ghost" onClick={toggleSidebar} className="text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>
          )}
          <nav className="space-y-2 px-2 mt-5">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${currentPage === "dashboard" ? "bg-white/10" : ""} text-white`}
              onClick={() => {
                setCurrentPage("dashboard");
                if (sidebarOpen) toggleSidebar();
              }}
            >
              <LayoutDashboard className="h-4 w-4 text-white" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${currentPage === "stocks" ? "bg-white/10" : ""} text-white`}
              onClick={() => {
                setCurrentPage("stocks");
                if (sidebarOpen) toggleSidebar();
              }}
            >
              <BarChart3 className="h-4 w-4 text-white" />
              Stocks
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${currentPage === "crypto" ? "bg-white/10" : ""} text-white`}
              onClick={() => {
                setCurrentPage("crypto");
                if (sidebarOpen) toggleSidebar();
              }}
            >
              <Globe className="h-4 w-4 text-white" />
              Crypto
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="bg-black text-white overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}