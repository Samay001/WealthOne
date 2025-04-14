"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";

import stockDataImport from "@//data/sample/stock.json";

interface StockPrice {
  symbol: string;
  companyName: string | null;
  industry: string | null;
  nsePrice: number | null;
  error?: string;
}

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

interface EnhancedStockData extends StockData {
  current_price?: number;
  investment?: string;
  balance?: string;
  pnl_string?: string;
  percent_change?: string;
  start_date?: string;
  industry?: string | null;
}

interface StockContextType {
  stocks: EnhancedStockData[];
  loading: boolean;
  error: string | null;
  updateStockData: (stockData: StockData[]) => Promise<void>;
  fetchStockPrices: (symbols: string[]) => Promise<Record<string, StockPrice>>;
  formatCurrency: (value: number) => string;
}

interface StockProviderProps {
  children: ReactNode;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<StockProviderProps> = ({ children }) => {
  const [stocks, setStocks] = useState<EnhancedStockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  }, []);

  const fetchStockPrices = async (
    symbols: string[]
  ): Promise<Record<string, StockPrice>> => {
    try {
      const uniqueSymbols = [...new Set(symbols)];
      const priceData: Record<string, StockPrice> = {};

      await Promise.all(
        uniqueSymbols.map(async (symbol) => {
          try {
            const response = await axios.get(
              "https://wealthone.onrender.com/api/stock/price",
              {
                params: { name: symbol },
                withCredentials: true,
              }
            );

            const data = response.data;

            priceData[symbol] = {
              symbol,
              companyName: data.companyName || null,
              industry: data.industry || null,
              nsePrice: data.nsePrice ? parseFloat(data.nsePrice) : null,
            };
          } catch (err) {
            console.error(`Error fetching ${symbol}:`, err);
            priceData[symbol] = {
              symbol,
              companyName: null,
              industry: null,
              nsePrice: null,
              error: err instanceof Error ? err.message : "Unknown error",
            };
          }
        })
      );

      return priceData;
    } catch (error) {
      console.error("Error fetching stock prices:", error);
      setError("Failed to fetch stock prices. Please try again later.");
      return {};
    }
  };

  const calculateStockMetrics = useCallback(
    (
      stockData: StockData[],
      marketPrices: Record<string, StockPrice>
    ): EnhancedStockData[] => {
      return stockData.map((stock) => {
        const symbol = stock.tradingsymbol;
        const priceData = marketPrices[symbol];
        const currentPrice = priceData?.nsePrice || stock.last_price;

        const investment = stock.average_price * stock.quantity;
        const balance = currentPrice * stock.quantity;
        const pnl = balance - investment;
        const percentChange =
          ((currentPrice - stock.average_price) / stock.average_price) * 100;
        const startDate = new Date().toLocaleDateString();

        return {
          ...stock,
          current_price: currentPrice,
          investment: formatCurrency(investment),
          balance: formatCurrency(balance),
          pnl_string: formatCurrency(pnl),
          percent_change: percentChange.toFixed(2),
          start_date: startDate,
          industry: priceData?.industry || null,
        };
      });
    },
    [formatCurrency]
  );

  const updateStockData = async (stockData: StockData[]): Promise<void> => {
    try {
      setLoading(true);
      const symbols = stockData.map((stock) => stock.tradingsymbol);
      const marketPrices = await fetchStockPrices(symbols);
      const updatedStocks = calculateStockMetrics(stockData, marketPrices);

      setStocks(updatedStocks);
      setError(null);
    } catch (error) {
      console.error("Error updating stock data:", error);
      setError("Failed to update stock data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize with imported data
  useEffect(() => {
    // Access the correct structure from the imported JSON
    const initialStockData: StockData[] = stockDataImport.data;
    updateStockData(initialStockData);
  }, []);

  const value: StockContextType = {
    stocks,
    loading,
    error,
    updateStockData,
    fetchStockPrices,
    formatCurrency,
  };

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};

export const useStocks = (): StockContextType => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error("useStocks must be used within a StockProvider");
  }
  return context;
};