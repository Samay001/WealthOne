// context/VaultContext.tsx
import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import axios from 'axios';
import symbolData from '@/data/sample/crypto-mapping.json';
import transactionData from '@/data/sample/crypto.json';

// Types
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

// Context type
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
};

// Create context with default values
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
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    endDate: new Date(),                                       // Today
  },
  setDateRange: () => {},
  formatCurrency: () => "",
  getMetricChange: () => ({ value: "", percentage: "", isPositive: true }),
});

// Provider component
export const VaultProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with transactionData from the import
  const [transactions, setTransactions] = useState<Transaction[]>(transactionData as Transaction[]);
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalBalance: 0,
    totalInvested: 0,
    totalReturn: 0,
    totalReturnPercentage: 0,
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    endDate: new Date(),                                       // Today
  });

  // Utility function for formatting currency
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  }, []);

  // Utility function to get metric change data
  const getMetricChange = useCallback((metric: keyof PortfolioMetrics): MetricChange => {
    if (metric === 'totalBalance') {
      return {
        value: formatCurrency(metrics.totalReturn),
        percentage: `${metrics.totalReturnPercentage > 0 ? '+' : '-'}${Math.abs(metrics.totalReturnPercentage).toFixed(2)}%`,
        isPositive: metrics.totalReturn >= 0
      };
    } else if (metric === 'totalInvested') {
      return {
        value: "",
        percentage: "",
        isPositive: true
      };
    } else if (metric === 'totalReturn') {
      return {
        value: "",
        percentage: `${metrics.totalReturnPercentage > 0 ? '+' : '-'}${Math.abs(metrics.totalReturnPercentage).toFixed(2)}%`,
        isPositive: metrics.totalReturn >= 0
      };
    } else {
      return {
        value: "",
        percentage: "",
        isPositive: true
      };
    }
  }, [metrics, formatCurrency]);

  // Aggregate transactions by symbol to calculate current holdings
  const aggregatedAssets = useMemo(() => {
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
        // Calculate new average price for buys
        const currentValue = asset.totalQuantity * asset.avgBuyPrice;
        const newValue = quantity * price;
        const totalQuantity = asset.totalQuantity + quantity;

        asset.avgBuyPrice =
          totalQuantity > 0 ? (currentValue + newValue) / totalQuantity : 0;
        asset.totalQuantity += quantity;
        asset.totalFee += fee;
      } else {
        // For sells, just reduce the quantity
        asset.totalQuantity -= quantity;
        asset.totalFee += fee;
      }

      // Update the timestamp if this transaction is newer
      if (timestamp > asset.lastUpdated) {
        asset.lastUpdated = timestamp;
      }
    });

    // Filter out assets with zero or negative quantity
    return Array.from(assetMap.values())
      .filter((asset) => asset.totalQuantity > 0)
      .sort((a, b) => b.lastUpdated - a.lastUpdated);
  }, [transactions]);

  // Fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const newPrices: Prices = {};

        const uniqueSymbols = Array.from(
          new Set(aggregatedAssets.map((asset) => asset.symbol))
        );

        const requests = uniqueSymbols.map(async (symbol) => {
          // Use the symbolData mapping to get the correct cryptoId
          const cryptoId = symbolData[symbol as keyof typeof symbolData]?.name;

          if (!cryptoId) {
            console.error(`No mapping found for symbol: ${symbol}`);
            newPrices[symbol] = null;
            return;
          }

          try {
            const response = await axios.get(
              `http://localhost:8080/api/crypto/prices`,
              {
                params: {
                  ids: cryptoId.toLowerCase(),
                  vs_currencies: "inr",
                },
                withCredentials: true,
              }
            );
            newPrices[symbol] =
              response.data?.[cryptoId.toLowerCase()]?.inr || null;
          } catch (err) {
            console.error(`Error fetching price for ${symbol}:`, err);
            newPrices[symbol] = null;
          }
        });

        // Wait for all requests to complete
        await Promise.all(requests);

        setPrices(newPrices);
        console.log("Fetched Prices:", newPrices);
        setError(null);
      } catch (err) {
        console.error("Error fetching prices:", err);
        setError("Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    };

    if (aggregatedAssets.length > 0) {
      fetchPrices();
    } else {
      setLoading(false);
    }
  }, [aggregatedAssets]);

  // Calculate metrics when prices or assets change
  useEffect(() => {
    if (!loading && Object.keys(prices).length > 0) {
      const totalInvested = aggregatedAssets.reduce(
        (sum, asset) =>
          sum + asset.avgBuyPrice * asset.totalQuantity + asset.totalFee,
        0
      );

      const totalCurrent = aggregatedAssets.reduce(
        (sum, asset) => sum + (prices[asset.symbol] || 0) * asset.totalQuantity,
        0
      );

      const totalReturn = totalCurrent - totalInvested;
      const totalReturnPercentage =
        totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

      // Update metrics
      setMetrics({
        totalBalance: totalCurrent,
        totalInvested: totalInvested,
        totalReturn: totalReturn,
        totalReturnPercentage: totalReturnPercentage,
      });
    }
  }, [prices, loading, aggregatedAssets]);

  return (
    <VaultContext.Provider
      value={{
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
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

// Custom hook to use the vault context
export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};