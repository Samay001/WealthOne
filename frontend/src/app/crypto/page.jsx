"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, AlertCircle, Clock, Menu } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useCrypto } from '@/app/context/cryptoContext'
import { useRouter } from 'next/navigation'

const Page = () => {
  const {
    cmpVisible,
    totalCryptoBalance,
    totalCryptoInvestment,
    totalCryptoReturn,
    isLoading,
    error,
    fetchCmpData,
    getCryptoData,
    cryptoData
  } = useCrypto()

  const cryptoDataWithCalculations = getCryptoData()

  const handleRefresh = () => {
    fetchCmpData()
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
  const pieChartData = cryptoDataWithCalculations.map((crypto, index) => ({
    name: crypto.name,
    value: crypto.currentValue || crypto.investment,
    percentage: totalCryptoBalance > 0 ? ((crypto.currentValue || crypto.investment) / totalCryptoBalance * 100).toFixed(1) : '0',
    color: `hsl(${index * 85}, 70%, 50%)`
  }))

  const barChartData = cryptoDataWithCalculations.map(crypto => ({
    name: crypto.name,
    investment: crypto.investment,
    currentValue: crypto.currentValue || crypto.investment,
    returnAmount: crypto.returnAmount || 0
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
                <h1 className="text-3xl font-bold tracking-tight text-white">Crypto Dashboard</h1>
                {cmpVisible && (
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-300" />
                    <p className="text-sm text-gray-300">Current market prices loaded</p>
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
                  onClick={() => router.push('/stocks')}
                  variant="outline"
                  className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  Stocks Dashboard
                </Button>
              </div>
              
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 w-full sm:w-auto"
                size="lg"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                {isLoading ? "Refreshing..." : "Refresh CMP"}
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
              <div className="text-3xl font-bold text-white">{formatCurrency(totalCryptoBalance)}</div>
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
              <div className="text-3xl font-bold text-white">{formatCurrency(totalCryptoInvestment)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                {totalCryptoReturn >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                Total Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold", getReturnColor(totalCryptoReturn))}>
                {totalCryptoInvestment > 0 ? `${totalCryptoReturn.toFixed(2)}%` : "N/A"}
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
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                      formatter={(value) => [formatCurrency(value), 'Value']}
                    />
                    <Legend />
                    <Bar dataKey="investment" name="Investment" fill="#3B82F6" />
                    <Bar dataKey="currentValue" name="Current Value" fill="#10B981" />
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

        {/* Crypto Holdings */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Crypto Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {cryptoDataWithCalculations.map((crypto) => (
                <Card key={crypto.id} className="bg-gray-950/50 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                          {/* Assuming the first letter of the symbol is desired */}
                          {crypto.symbol.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg tracking-wide text-white">{crypto.name}</h3>
                        <p className="text-sm text-gray-300 truncate">{crypto.symbol}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">Avg. Buy Price</p>
                        <p className="font-semibold text-white">{formatCurrency(crypto.price)}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">Quantity</p>
                        <p className="font-semibold text-white">{crypto.quantity}</p>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">CMP</p>
                        <p className="font-semibold text-white">
                          {crypto.hasCurrentData ? (
                            formatCurrency(crypto.cmp)
                          ) : (
                            <span className="text-yellow-400">Refresh needed</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300">Investment</p>
                        <p className="font-semibold text-white">{formatCurrency(crypto.investment)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">Current Value</p>
                        <p className="font-semibold text-white">
                          {crypto.currentValue !== null ? (
                            formatCurrency(crypto.currentValue)
                          ) : (
                            <span className="text-yellow-400">Refresh needed</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300">P&L</p>
                        <p className={cn("font-semibold", getReturnColor(crypto.returnAmount || 0))}>
                          {crypto.returnAmount !== null
                            ? `${crypto.returnAmount >= 0 ? "+" : ""}${formatCurrency(crypto.returnAmount)}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {crypto.returnPercentage !== null && (
                      <div
                        className={cn("p-3 rounded-lg border text-center", getReturnBgColor(crypto.returnPercentage))}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {crypto.returnPercentage >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className={cn("font-bold", getReturnColor(crypto.returnPercentage))}>
                            {crypto.returnPercentage.toFixed(2)}%
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
