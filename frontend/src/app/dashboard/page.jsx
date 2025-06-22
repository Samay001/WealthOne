"use client"
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Activity, RefreshCw, AlertCircle, Clock, Menu } from 'lucide-react';
import { useCrypto } from '../context/cryptoContext';
import { useStock } from '../context/stockContext';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import Link from "next/link";

const UnifiedDashboard = ({ 
  // Crypto context
  totalCryptoBalance,
  totalCryptoInvestment,
  totalCryptoReturn,
  isLoading: cryptoLoading,
  error: cryptoError,
  fetchCmpData,
  getCryptoData,
  
  // Stock context  
  totalStockBalance,
  totalStockInvestment,
  totalStockReturn,
  loading: stockLoading,
  error: stockError,
  lastUpdated,
  fetchAllCmpPrices,
  getStockData,
  isDataStale
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Calculate portfolio totals
  const totalBalance = (totalCryptoBalance || 0) + (totalStockBalance || 0);
  const totalInvestment = (totalCryptoInvestment || 0) + (totalStockInvestment || 0);
  const totalReturn = (totalCryptoReturn || 0) + (totalStockReturn || 0);
  const totalReturnPercent = totalInvestment > 0 ? ((totalReturn / totalInvestment) * 100).toFixed(2) : 0;

  // Calculate individual return percentages
  const cryptoReturnPercent = totalCryptoInvestment > 0 ? ((totalCryptoReturn / totalCryptoInvestment) * 100).toFixed(2) : 0;
  const stockReturnPercent = totalStockInvestment > 0 ? ((totalStockReturn / totalStockInvestment) * 100).toFixed(2) : 0;

  // Portfolio composition data for pie chart
  const portfolioComposition = [
    { 
      name: 'Stocks', 
      value: totalStockBalance || 0, 
      color: '#3B82F6',
      investment: totalStockInvestment || 0,
      return: totalStockReturn || 0
    },
    { 
      name: 'Crypto', 
      value: totalCryptoBalance || 0, 
      color: '#F59E0B',
      investment: totalCryptoInvestment || 0,
      return: totalCryptoReturn || 0
    }
  ];

  // Performance comparison data for bar chart
  const performanceData = [
    {
      category: 'Stocks',
      Investment: totalStockInvestment || 0,
      'Current Value': totalStockBalance || 0,
      Return: totalStockReturn || 0
    },
    {
      category: 'Crypto',
      Investment: totalCryptoInvestment || 0,
      'Current Value': totalCryptoBalance || 0,
      Return: totalCryptoReturn || 0
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchAllCmpPrices && fetchAllCmpPrices(),
        fetchCmpData && fetchCmpData()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const StatCard = ({ title, value, change, changePercent, icon: Icon, color = 'blue' }) => {
    const isPositive = change >= 0;
    const colorClasses = {
      blue: 'bg-gray-900/50 border-gray-800',
      green: 'bg-gray-900/50 border-gray-800',
      orange: 'bg-gray-900/50 border-gray-800',
      purple: 'bg-gray-900/50 border-gray-800'
    };

    return (
      <div className={`p-6 rounded-xl border ${colorClasses[color]} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">{title}</h3>
          <Icon className="h-6 w-6 text-gray-300" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-white">{formatCurrency(value)}</p>
          {change !== undefined && (
            <div className="flex items-center space-x-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(Math.abs(change))} ({Math.abs(changePercent)}%)
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 rounded-lg">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-gray-300">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (cryptoLoading || stockLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-xl text-gray-300">Server is on Render, Might take upto a minute or two</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex justify-between w-full sm:w-auto">
              <div>
                <Link href={"/"}>
                  <h1 className="text-3xl font-bold tracking-tight text-white">Portfolio Dashboard</h1>
                </Link>
                <p className="text-gray-400 mt-1">
                  Unified view of your investments
                </p>
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden text-white hover:text-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto`}>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => router.push('/stocks')}
                  variant="outline"
                  className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  Stocks Dashboard
                </Button>
                <Button
                  onClick={() => router.push('/crypto')}
                  variant="outline"
                  className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  Crypto Dashboard
                </Button>
              </div>
              
              {lastUpdated && (
                <div className="hidden md:flex items-center text-sm text-gray-400 whitespace-nowrap">
                  <Clock className="h-4 w-4 mr-1" />
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                  {isDataStale && (
                    <AlertCircle className="h-4 w-4 ml-2 text-yellow-500" />
                  )}
                </div>
              )}
              
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Error Messages */}
        {(cryptoError || stockError) && (
          <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-red-400 font-medium">Data Loading Issues</h3>
                {cryptoError && <p className="text-red-300 text-sm">Crypto: {cryptoError}</p>}
                {stockError && <p className="text-red-300 text-sm">Stocks: {stockError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Portfolio"
            value={totalBalance}
            change={totalReturn}
            changePercent={totalReturnPercent}
            icon={IndianRupee}
            color="blue"
          />
          
          <StatCard
            title="Stock Holdings"
            value={totalStockBalance}
            change={totalStockReturn}
            changePercent={stockReturnPercent}
            icon={TrendingUp}
            color="green"
          />
          
          <StatCard
            title="Crypto Holdings"
            value={totalCryptoBalance}
            change={totalCryptoReturn}
            changePercent={cryptoReturnPercent}
            icon={Activity}
            color="orange"
          />
          
          <StatCard
            title="Total Investment"
            value={totalInvestment}
            icon={IndianRupee}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Composition */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Portfolio Composition</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioComposition}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Comparison */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Performance Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={CustomTooltip} />
                <Legend />
                <Bar dataKey="Investment" fill="#94A3B8" name="Investment" />
                <Bar dataKey="Current Value" fill="#3B82F6" name="Current Value" />
                <Bar dataKey="Return" fill="#10B981" name="Return" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Portfolio Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-950/50 rounded-lg border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Asset Allocation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Stocks:</span>
                  <span className="text-sm font-medium text-white">
                    {totalBalance > 0 ? ((totalStockBalance / totalBalance) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Crypto:</span>
                  <span className="text-sm font-medium text-white">
                    {totalBalance > 0 ? ((totalCryptoBalance / totalBalance) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-950/50 rounded-lg border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Total Returns</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Amount:</span>
                  <span className={`text-sm font-medium ${totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(totalReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Percentage:</span>
                  <span className={`text-sm font-medium ${totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {totalReturnPercent}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-950/50 rounded-lg border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Investment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Invested:</span>
                  <span className="text-sm font-medium text-white">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Current:</span>
                  <span className="text-sm font-medium text-white">{formatCurrency(totalBalance)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage component that integrates your hooks
const DashboardPage = () => {
  const {
    totalCryptoBalance,
    totalCryptoInvestment,
    totalCryptoReturn,
    isLoading,
    error,
    fetchCmpData,
    getCryptoData,
  } = useCrypto();

  const {
    totalStockBalance,
    totalStockInvestment,
    totalStockReturn,
    loading,
    error: stockError,
    lastUpdated,
    fetchAllCmpPrices,
    getStockData,
    isDataStale
  } = useStock();

  return (
    <UnifiedDashboard
      totalCryptoBalance={totalCryptoBalance}
      totalCryptoInvestment={totalCryptoInvestment}
      totalCryptoReturn={totalCryptoReturn}
      isLoading={isLoading}
      error={error}
      fetchCmpData={fetchCmpData}
      getCryptoData={getCryptoData}
      totalStockBalance={totalStockBalance}
      totalStockInvestment={totalStockInvestment}
      totalStockReturn={totalStockReturn}
      loading={loading}
      stockError={stockError}
      lastUpdated={lastUpdated}
      fetchAllCmpPrices={fetchAllCmpPrices}
      getStockData={getStockData}
      isDataStale={isDataStale}
    />
  );
};

export default DashboardPage;