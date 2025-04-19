// app/context/stockContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Stock interface matching your existing structure
export interface Stock {
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
  current_price?: number; 
}

// Response structure from your API
interface CurrentPriceResponse {
  currentPrice: {
    BSE: string;
    NSE: string;
  };
}

// Stock context type definition
interface StockContextType {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  updateStockData: (data: Stock[]) => void;
  refreshStockPrice: (symbol: string) => Promise<void>;
  getStockBySymbol: (symbol: string) => Stock | undefined;
  calculateTotalPnL: () => number;
  getStocksByExchange: (exchange: string) => Stock[];
  formatCurrency: (value: number) => string;
}

// Create context with default value
const StockContext = createContext<StockContextType | undefined>(undefined);

// Provider props interface
interface StockProviderProps {
  children: ReactNode;
}

export const StockProvider: React.FC<StockProviderProps> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Update stock data with initial data or refreshed data
  const updateStockData = useCallback((data: Stock[]) => {
    setStocks(data);
    setLoading(false);
    setError(null);
  }, []);

  // Format currency in INR
  const formatCurrency = useCallback((value: number): string => {
    return `₹${value.toLocaleString('en-IN', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2 
    })}`;
  }, []);

  // Get a specific stock by trading symbol
  const getStockBySymbol = useCallback((symbol: string): Stock | undefined => {
    return stocks.find(stock => stock.trading_symbol === symbol);
  }, [stocks]);

  // Refresh current price for a specific stock
  const refreshStockPrice = useCallback(async (symbol: string): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch(`https://wealthone.onrender.com/api/v1/stock?name=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stock price: ${response.statusText}`);
      }
      
      const data: CurrentPriceResponse = await response.json();
      
      // Update the specific stock with current price data
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          if (stock.trading_symbol === symbol) {
            // Use NSE price as current_price or fallback to BSE
            const currentPrice = data.currentPrice.NSE 
              ? parseFloat(data.currentPrice.NSE) 
              : parseFloat(data.currentPrice.BSE);
              
            return { 
              ...stock, 
              current_price: currentPrice
            };
          }
          return stock;
        })
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate total PnL for all stocks
  const calculateTotalPnL = useCallback((): number => {
    return stocks.reduce((sum, stock) => {
      const currentPrice = stock.current_price || stock.last_price;
      const currentValue = currentPrice * stock.quantity;
      const investment = stock.average_price * stock.quantity;
      return sum + (currentValue - investment);
    }, 0);
  }, [stocks]);

  // Get stocks filtered by exchange
  const getStocksByExchange = useCallback((exchange: string): Stock[] => {
    return stocks.filter(stock => stock.exchange === exchange);
  }, [stocks]);

  // Context value
  const value = {
    stocks,
    loading,
    error,
    updateStockData,
    refreshStockPrice,
    getStockBySymbol,
    calculateTotalPnL,
    getStocksByExchange,
    formatCurrency
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
};

// Custom hook to use the stock context
export const useStocks = (): StockContextType => {
  const context = useContext(StockContext);
  
  if (context === undefined) {
    throw new Error('useStocks must be used within a StockProvider');
  }
  
  return context;
};