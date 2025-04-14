"use client";
import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import axios from 'axios';
import symbolData from '@/data/sample/crypto-mapping.json';
import transactionData from '@/data/sample/crypto.json';

export type Transaction = {
  id: number;
  order_id: string;
  side: string;
  fee_amount: string;
  ecode: string;
  quantity: string;
  price: string;
  symbol: string;
  timestamp: number;
};

export type Prices = {
  [key: string]: number | null;
};

export type AggregatedAsset = {
  symbol: string;
  totalQuantity: number;
  avgBuyPrice: number;
  totalFee: number;
  lastUpdated: number;
  order_type: string;
};

export type PortfolioMetrics = {
  totalBalance: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercentage: number;
};

export type MetricChange = {
  value: string;
  percentage: string;
  isPositive: boolean;
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

type DataAvailability = {
  transactions: boolean;
  prices: boolean;
};

type VaultContextType = {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  aggregatedAssets: AggregatedAsset[];
  prices: Prices;
  loading: boolean;
  error: string | null;
  metrics: PortfolioMetrics;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  formatCurrency: (value: number) => string;
  getMetricChange: (metric: keyof PortfolioMetrics) => MetricChange;
  dataAvailable: DataAvailability;
};

const VaultContext = createContext<VaultContextType>({
  transactions: [],
  setTransactions: () => {},
  aggregatedAssets: [],
  prices: {},
  loading: true,
  error: null,
  metrics: {
    totalBalance: 0,
    totalInvested: 0,
    totalReturn: 0,
    totalReturnPercentage: 0,
  },
  dateRange: {
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  setDateRange: () => {},
  formatCurrency: () => "",
  getMetricChange: () => ({ value: "", percentage: "", isPositive: true }),
  dataAvailable: {
    transactions: false,
    prices: false
  }
});

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionData as Transaction[]);
  const [prices, setPrices] = useState<Prices>({});
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalBalance: 0,
    totalInvested: 0,
    totalReturn: 0,
    totalReturnPercentage: 0,
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [dataAvailable, setDataAvailable] = useState<DataAvailability>({
    transactions: false,
    prices: false
  });

  // Initialize transactions
  useEffect(() => {
    setDataAvailable(prev => ({...prev, transactions: true}));
  }, []);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  }, []);

  const getMetricChange = useCallback((metric: keyof PortfolioMetrics): MetricChange => {
    const value = metrics[metric];
    const isPositive = value >= 0;
    const sign = isPositive ? '+' : '-';

    switch(metric) {
      case 'totalBalance':
        return {
          value: formatCurrency(metrics.totalReturn),
          percentage: `${sign}${Math.abs(metrics.totalReturnPercentage).toFixed(2)}%`,
          isPositive
        };
      case 'totalReturn':
        return {
          value: formatCurrency(metrics.totalReturn),
          percentage: `${sign}${Math.abs(metrics.totalReturnPercentage).toFixed(2)}%`,
          isPositive
        };
      default:
        return {
          value: "",
          percentage: "",
          isPositive: true
        };
    }
  }, [metrics, formatCurrency]);

  const aggregatedAssets = useMemo(() => {
    if (!dataAvailable.transactions) return [];

    const assetMap = new Map<string, AggregatedAsset>();

    transactions.forEach((transaction) => {
      const symbol = transaction.symbol;
      const quantity = parseFloat(transaction.quantity);
      const price = parseFloat(transaction.price);
      const fee = parseFloat(transaction.fee_amount);
      const timestamp = transaction.timestamp;
      const side = transaction.side;

      if (!assetMap.has(symbol)) {
        assetMap.set(symbol, {
          symbol,
          totalQuantity: 0,
          avgBuyPrice: 0,
          totalFee: 0,
          lastUpdated: 0,
          order_type: side === "buy" ? "market_order" : "limit_order", 
        });
      }

      const asset = assetMap.get(symbol)!;

      if (side === "buy") {
        const currentValue = asset.totalQuantity * asset.avgBuyPrice;
        const newValue = quantity * price;
        const totalQuantity = asset.totalQuantity + quantity;

        asset.avgBuyPrice = totalQuantity > 0 ? (currentValue + newValue) / totalQuantity : 0;
        asset.totalQuantity += quantity;
      } else {
        asset.totalQuantity -= quantity;
      }

      asset.totalFee += fee;
      asset.lastUpdated = Math.max(asset.lastUpdated, timestamp);
    });

    return Array.from(assetMap.values())
      .filter((asset) => asset.totalQuantity > 0)
      .sort((a, b) => b.lastUpdated - a.lastUpdated);
  }, [transactions, dataAvailable.transactions]);

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      const newPrices: Prices = {};
      
      // Try cache first
      try {
        const cachedPrices = localStorage.getItem('cryptoPrices');
        if (cachedPrices) {
          Object.assign(newPrices, JSON.parse(cachedPrices));
        }
      } catch (cacheError) {
        console.warn("Failed to read price cache", cacheError);
      }

      // Fetch fresh prices
      const uniqueSymbols = Array.from(
        new Set(aggregatedAssets.map((asset) => asset.symbol))
      );

      await Promise.all(uniqueSymbols.map(async (symbol) => {
        const cryptoId = symbolData[symbol as keyof typeof symbolData]?.name;
        if (!cryptoId) {
          console.warn(`No mapping found for symbol: ${symbol}`);
          newPrices[symbol] = newPrices[symbol] || null;
          return;
        }

        try {
          const response = await axios.get(
            `https://wealthone.onrender.com/api/crypto/prices`,
            {
              params: {
                ids: cryptoId.toLowerCase(),
                vs_currencies: "inr",
              },
              withCredentials: true,
              timeout: 5000 // 5 second timeout
            }
          );
          newPrices[symbol] = response.data?.[cryptoId.toLowerCase()]?.inr || null;
        } catch (apiError) {
          console.warn(`Failed to fetch price for ${symbol}:`, apiError);
          newPrices[symbol] = newPrices[symbol] || null;
        }
      }));

      // Update state and cache
      setPrices(newPrices);
      localStorage.setItem('cryptoPrices', JSON.stringify(newPrices));
      setDataAvailable(prev => ({...prev, prices: true}));
    } catch (err) {
      console.error("Price fetch error:", err);
      setError("Failed to update some prices");
      setDataAvailable(prev => ({...prev, prices: false}));
    }
  }, [aggregatedAssets]);

  // Fetch prices when assets change
  useEffect(() => {
    if (dataAvailable.transactions && aggregatedAssets.length > 0) {
      fetchPrices();
    }
  }, [aggregatedAssets, dataAvailable.transactions, fetchPrices]);

  // Calculate metrics
  useEffect(() => {
    if (dataAvailable.transactions) {
      const totalInvested = aggregatedAssets.reduce(
        (sum, asset) => sum + asset.avgBuyPrice * asset.totalQuantity + asset.totalFee,
        0
      );

      const totalCurrent = aggregatedAssets.reduce(
        (sum, asset) => sum + (prices[asset.symbol] || asset.avgBuyPrice) * asset.totalQuantity,
        0
      );

      const totalReturn = totalCurrent - totalInvested;
      const totalReturnPercentage = totalInvested > 0 ? 
        (totalReturn / totalInvested) * 100 : 0;

      setMetrics({
        totalBalance: totalCurrent,
        totalInvested,
        totalReturn,
        totalReturnPercentage
      });
    }
  }, [prices, aggregatedAssets, dataAvailable.transactions]);

  const loading = useMemo(() => {
    return !dataAvailable.transactions || 
           (aggregatedAssets.length > 0 && !dataAvailable.prices);
  }, [dataAvailable, aggregatedAssets]);

  const contextValue = useMemo(() => ({
    transactions,
    setTransactions,
    aggregatedAssets,
    prices,
    loading,
    error,
    metrics,
    dateRange,
    setDateRange,
    formatCurrency,
    getMetricChange,
    dataAvailable
  }), [
    transactions,
    aggregatedAssets,
    prices,
    loading,
    error,
    metrics,
    dateRange,
    formatCurrency,
    getMetricChange,
    dataAvailable
  ]);

  return (
    <VaultContext.Provider value={contextValue}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};