"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/metrics-card";
import { PieComponent } from "@/components/pie-chart";
import { LineComponent } from "@/components/line-chart";
import CryptoDashboard from "@/app/crypto/page";
import StockDashboard from "@/app/stocks/page";
import {
  BarChart3,
  Globe,
  Home,
  LayoutDashboard,
  Wallet,
  Menu,
  X,
} from "lucide-react";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <main className="p-6 bg-black text-white w-full min-h-screen">
            <div className="mb-8 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white">Overview</h1>
                <div className="text-sm text-white/50">
                  Aug 13, 2023 - Aug 18, 2023
                </div>
              </div>
            </div>

            {/* Metrics Cards Section */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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

            {/* Charts Section */}
            <div className="chart-theme flex flex-col md:flex-row gap-4 w-full ">
              <div className="md:w-1/3 min-h-[100px]">
                <PieComponent />
              </div>
              <div className="md:w-1/3 min-h-[300px]">
                <LineComponent />
              </div>
              <div className="md:w-1/3 min-h-[300px]">
                <LineComponent />
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
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-white" />
          <span className="font-bold text-white">Wealth One</span>
        </div>
        <Button variant="ghost" onClick={toggleSidebar} className="text-white">
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar - responsive */}
        <aside
          className={`
          ${sidebarOpen ? "fixed inset-0 z-50 bg-black" : "hidden"} 
          lg:relative lg:block border-r border-white/20 bg-black
        `}
        >
          <div className="hidden lg:flex h-16 items-center gap-2 border-b border-white/20 px-6">
            <Wallet className="h-6 w-6 text-white" />
            <span className="font-bold text-white">Wealth One</span>
          </div>
          {sidebarOpen && (
            <div className="flex lg:hidden items-center justify-end p-4">
              <Button
                variant="ghost"
                onClick={toggleSidebar}
                className="text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          )}
          <nav className="space-y-2 px-2 mt-5">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white"
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
              className="w-full justify-start gap-2 text-white"
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
              className="w-full justify-start gap-2 text-white"
              onClick={() => {
                setCurrentPage("crypto");
                if (sidebarOpen) toggleSidebar();
              }}
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

        {/* Main content */}
        <main className=" bg-black text-white overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
