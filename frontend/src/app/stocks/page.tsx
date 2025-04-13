"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table-stock";
import { useStocks } from "@/app/context/stockContext";
import sampleStockData from "@/data/sample/stock.json";

interface StockData {
  isin: string;
  cnc_used_quantity: number;
  collateral_type: string;
  company_name: string;
  haircut: number;
  product: string;
  quantity: number;
  trading_symbol: string;
  tradingsymbol: string;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  instrument_token: string;
  average_price: number;
  collateral_quantity: number;
  collateral_update_quantity: number;
  t1_quantity: number;
  exchange: string;
  logo_svg_url: string;
  position: string;
}

export default function StockDashboard() {
  const { stocks, loading, error, updateStockData, formatCurrency } = useStocks();

  useEffect(() => {
    const stockData = sampleStockData.data as StockData[];
    
    updateStockData(stockData);
    
    const intervalId = setInterval(() => {
      updateStockData(stockData);
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [updateStockData]);

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    if (!stocks.length) return "₹0";
    
    const total = stocks.reduce((sum, stock) => {
      const currentPrice = stock.current_price || stock.last_price;
      return sum + (currentPrice * stock.quantity);
    }, 0);
    
    return formatCurrency ? formatCurrency(total) : `₹${total.toLocaleString('en-IN')}`;
  };
  
  // Calculate total investment
  const calculateTotalInvestment = () => {
    if (!stocks.length) return "₹0";
    
    const total = stocks.reduce((sum, stock) => {
      return sum + (stock.average_price * stock.quantity);
    }, 0);
    
    return formatCurrency ? formatCurrency(total) : `₹${total.toLocaleString('en-IN')}`;
  };
  
  // Calculate total profit/loss
  const calculateTotalPnL = () => {
    if (!stocks.length) return "₹0";
    
    const total = stocks.reduce((sum, stock) => {
      const currentPrice = stock.current_price || stock.last_price;
      const currentValue = currentPrice * stock.quantity;
      const investment = stock.average_price * stock.quantity;
      return sum + (currentValue - investment);
    }, 0);
    
    return formatCurrency ? formatCurrency(total) : `₹${total.toLocaleString('en-IN')}`;
  };
  
  // Calculate PnL percentage
  const calculatePnLPercentage = () => {
    if (!stocks.length) return "0%";
    
    const totalInvestment = stocks.reduce((sum, stock) => {
      return sum + (stock.average_price * stock.quantity);
    }, 0);
    
    const totalCurrent = stocks.reduce((sum, stock) => {
      const currentPrice = stock.current_price || stock.last_price;
      return sum + (currentPrice * stock.quantity);
    }, 0);
    
    const totalPnL = totalCurrent - totalInvestment;
    const percentage = (totalPnL / totalInvestment) * 100;
    
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };
  
  // Check if PnL is positive
  const isPnLPositive = () => {
    if (!stocks.length) return true;
    
    const totalInvestment = stocks.reduce((sum, stock) => {
      return sum + (stock.average_price * stock.quantity);
    }, 0);
    
    const totalCurrent = stocks.reduce((sum, stock) => {
      const currentPrice = stock.current_price || stock.last_price;
      return sum + (currentPrice * stock.quantity);
    }, 0);
    
    return totalCurrent >= totalInvestment;
  };

  if (loading && stocks.length === 0) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading stock data...</div>;
  }

  if (error && stocks.length === 0) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className="w-full">
        <main className="p-6 bg-black text-white w-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Stocks Overview</h1>
              <div className="text-sm text-white/50">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Your Balance"
              value={calculateTotalValue()}
              change={{
                value: calculateTotalPnL(),
                percentage: calculatePnLPercentage(),
                isPositive: isPnLPositive(),
              }}
            />
            <MetricsCard
              title="Your Deposits"
              value={calculateTotalInvestment()}
              change={{
                value: "",
                percentage: "",
                isPositive: true,
              }}
            />
            <MetricsCard
              title="Return"
              value={calculateTotalPnL()}
              change={{
                value: "",
                percentage: calculatePnLPercentage(),
                isPositive: isPnLPositive(),
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
                  Monthly
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