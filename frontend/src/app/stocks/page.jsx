"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, AlertCircle, Clock, Menu } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useStock } from '@/app/context/stockContext';
import { useRouter } from 'next/navigation'

const Page = () => {
  const {
    totalStockBalance,
    totalStockInvestment,
    totalStockReturn,
    loading,
    error,
    lastUpdated,
    fetchAllCmpPrices,
    getStockData,
    isDataStale,
  } = useStock()

  const stockDataWithCalculations = getStockData()

  const handleRefresh = () => {
    fetchAllCmpPrices()
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never"
    return lastUpdated.toLocaleString()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getReturnColor = (returnValue) => {
    if (returnValue > 0) return "text-emerald-400"
    if (returnValue < 0) return "text-red-400"
    return "text-gray-300"
  }

  const getReturnBgColor = (returnValue) => {
    if (returnValue > 0) return "bg-emerald-500/10 border-emerald-500/20"
    if (returnValue < 0) return "bg-red-500/10 border-red-500/20"
    return "bg-gray-500/10 border-gray-500/20"
  }

  // Prepare data for charts
  const pieChartData = stockDataWithCalculations.map((stock, index) => ({
    name: stock.symbol,
    value: stock.currentValue || stock.investment,
    percentage: totalStockBalance > 0 ? ((stock.currentValue || stock.investment) / totalStockBalance * 100).toFixed(1) : '0',
    color: `hsl(${index * 85}, 70%, 50%)`
  }))

  const barChartData = stockDataWithCalculations.map(stock => ({
    symbol: stock.symbol,
    investment: stock.investment,
    currentValue: stock.currentValue || stock.investment,
    returnAmount: stock.returnAmount || 0
  }))

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  const cn = (...classes) => classes.filter(Boolean).join(' ')

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex justify-between w-full sm:w-auto">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Stock Dashboard</h1>
                {lastUpdated && (
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-300" />
                    <p className="text-sm text-gray-300">Last updated: {formatLastUpdated()}</p>
                    {isDataStale() && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10">
                        Stale Data
                      </Badge>
                    )}
                  </div>
                )}
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
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  Main Dashboard
                </Button>
                <Button
                  onClick={() => router.push('/crypto')}
                  variant="outline"
                  className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  Crypto Dashboard
                </Button>
              </div>
              
              <Button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 w-full sm:w-auto"
                size="lg"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                {loading ? "Refreshing..." : "Refresh CMP"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-8 bg-red-950/50 border-red-500/30 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(totalStockBalance)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Total Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(totalStockInvestment)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                {totalStockReturn >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                Total Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold", getReturnColor(totalStockReturn))}>
                {totalStockInvestment > 0 ? `${totalStockReturn.toFixed(2)}%` : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5" />
                Investment vs Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="symbol" 
                      tick={{ fill: '#d1d5db', fontSize: 12 }}
                      axisLine={{ stroke: '#6b7280' }}
                    />
                    <YAxis 
                      tick={{ fill: '#d1d5db', fontSize: 12 }}
                      axisLine={{ stroke: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                      formatter={(value, name) => [
                        formatCurrency(value),
                        name === 'investment' ? 'Investment' : 'Current Value'
                      ]}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#d1d5db' }}
                    />
                    <Bar dataKey="investment" fill="#3b82f6" name="Investment" />
                    <Bar dataKey="currentValue" fill="#10b981" name="Current Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PieChart className="h-5 w-5" />
                Portfolio Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                      formatter={(value) => [formatCurrency(value), 'Value']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Holdings */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Stock Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {stockDataWithCalculations.map((stock) => (
                <Card key={stock.id} className="bg-gray-950/50 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                          {stock.symbol.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg uppercase tracking-wide text-white">{stock.symbol}</h3>
                        <p className="text-sm text-gray-300 truncate">{stock.name}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">Avg. Buy Price</p>
                        <p className="font-semibold text-white">{formatCurrency(stock.price)}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">Quantity</p>
                        <p className="font-semibold text-white">{stock.quantity}</p>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">CMP (NSE)</p>
                        <p className="font-semibold text-white">
                          {stock.hasCurrentData ? (
                            formatCurrency(stock.cmp)
                          ) : (
                            <span className="text-yellow-400">Refresh needed</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300">Investment</p>
                        <p className="font-semibold text-white">{formatCurrency(stock.investment)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">Current Value</p>
                        <p className="font-semibold text-white">
                          {stock.currentValue !== null ? (
                            formatCurrency(stock.currentValue)
                          ) : (
                            <span className="text-yellow-400">Refresh needed</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300">P&L</p>
                        <p className={cn("font-semibold", getReturnColor(stock.returnAmount || 0))}>
                          {stock.returnAmount !== null
                            ? `${stock.returnAmount >= 0 ? "+" : ""}${formatCurrency(stock.returnAmount)}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {stock.returnPercentage !== null && (
                      <div
                        className={cn("p-3 rounded-lg border text-center", getReturnBgColor(stock.returnPercentage))}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {stock.returnPercentage >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className={cn("font-bold", getReturnColor(stock.returnPercentage))}>
                            {stock.returnPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page