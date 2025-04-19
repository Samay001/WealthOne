// useStockData.ts
import { useEffect, useRef } from 'react';
import { useStocks } from '@/app/context/stockContext';

export const useStockPrice = (symbol: string, autoRefresh = false, interval = 60000) => {
  const { stocks, loading, error, refreshStockPrice } = useStocks();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stock = stocks.find(s => s.trading_symbol === symbol);

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Initial fetch
    refreshStockPrice(symbol);

    // Auto-refresh setup
    if (autoRefresh && interval > 0) {
      intervalRef.current = setInterval(() => {
        refreshStockPrice(symbol);
      }, interval);
    }

    // Cleanup on unmount or change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, autoRefresh, interval]);

  return {
    stock,
    loading,
    error,
    refreshPrice: () => refreshStockPrice(symbol),
  };
};

export const usePortfolioAnalysis = () => {
  const { stocks, calculateTotalPnL } = useStocks();

  const totalInvestment = stocks.reduce(
    (total, stock) => total + stock.average_price * stock.quantity,
    0
  );

  const totalCurrentValue = stocks.reduce((total, stock) => {
    const currentPrice = stock.current_price ?? stock.last_price;
    return total + currentPrice * stock.quantity;
  }, 0);

  const profitLoss = totalCurrentValue - totalInvestment;
  const profitLossPercentage = totalInvestment > 0
    ? (profitLoss / totalInvestment) * 100
    : 0;

  return {
    totalInvestment,
    totalCurrentValue,
    profitLoss,
    profitLossPercentage,
    totalPnL: calculateTotalPnL(),
  };
};
