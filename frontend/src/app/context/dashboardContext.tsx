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
import { useStocks } from "@/app/context/stockContext";
import { useVault } from "@/app/context/cryptoContext";

interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
}

interface PortfolioAsset {
  name: string;
  symbol: string;
  type: string;
  value: number;
  quantity: number;
  price: number;
  investment: number;
  pnl: number;
  pnlPercentage: number;
}

interface PortfolioMetrics {
  totalBalance: number;
  totalInvestment: number;
  totalPnl: number;
  totalPnlPercentage: number;
  stocksBalance: number;
  stocksInvestment: number;
  stocksPnl: number;
  stocksPnlPercentage: number;
  cryptoBalance: number;
  cryptoInvestment: number;
  cryptoPnl: number;
  cryptoPnlPercentage: number;
  assetAllocation: AssetAllocation[];
  topHoldings: PortfolioAsset[];
  dataAvailable: {
    stocks: boolean;
    crypto: boolean;
  };
}

interface PortfolioContextType {
  metrics: PortfolioMetrics;
  loading: boolean;
  error: string | null;
  formatCurrency: (value: number) => string;
  getFormattedMetrics: () => FormattedPortfolioMetrics;
  refreshData: () => void;
}

interface FormattedPortfolioMetrics {
  totalBalance: string;
  totalInvestment: string;
  totalPnl: string;
  totalPnlPercentage: string;
  stocksBalance: string;
  stocksInvestment: string;
  stocksPnl: string;
  stocksPnlPercentage: string;
  cryptoBalance: string;
  cryptoInvestment: string;
  cryptoPnl: string;
  cryptoPnlPercentage: string;
}

interface PortfolioProviderProps {
  children: ReactNode;
}

const defaultMetrics: PortfolioMetrics = {
  totalBalance: 0,
  totalInvestment: 0,
  totalPnl: 0,
  totalPnlPercentage: 0,
  stocksBalance: 0,
  stocksInvestment: 0,
  stocksPnl: 0,
  stocksPnlPercentage: 0,
  cryptoBalance: 0,
  cryptoInvestment: 0,
  cryptoPnl: 0,
  cryptoPnlPercentage: 0,
  assetAllocation: [],
  topHoldings: [],
  dataAvailable: {
    stocks: false,
    crypto: false
  }
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  console.log("[Dashboard] Initializing PortfolioProvider");
  
  const [metrics, setMetrics] = useState<PortfolioMetrics>(defaultMetrics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  const { 
    stocks, 
    loading: stocksLoading, 
    error: stocksError,
    formatCurrency: stockFormatCurrency
  } = useStocks();
  
  const { 
    aggregatedAssets, 
    prices, 
    metrics: cryptoMetrics, 
    loading: cryptoLoading, 
    error: cryptoError,
    dataAvailable: cryptoDataAvailable
  } = useVault();

  console.log("[Dashboard] Context states:", {
    stocks: { loading: stocksLoading, count: stocks.length, error: stocksError },
    crypto: { loading: cryptoLoading, count: aggregatedAssets?.length, error: cryptoError, dataAvailable: cryptoDataAvailable }
  });

  const formatCurrency = useCallback((value: number): string => {
    return stockFormatCurrency(value);
  }, [stockFormatCurrency]);

  const refreshData = useCallback(() => {
    console.log("[Dashboard] Manual refresh initiated");
    setLastRefresh(Date.now());
  }, []);

  // Process stocks data
  useEffect(() => {
    if (stocksLoading) return;

    console.group("[Dashboard] Processing stocks data");
    try {
      if (stocksError) {
        console.error("Stocks error:", stocksError);
        throw new Error(stocksError);
      }

      if (stocks.length === 0) {
        console.log("No stocks data available");
        setMetrics(prev => ({
          ...prev,
          dataAvailable: { ...prev.dataAvailable, stocks: false }
        }));
        return;
      }

      console.log(`Processing ${stocks.length} stocks`);
      
      let stocksBalance = 0;
      let stocksInvestment = 0;
      let stocksPnl = 0;
      const stockAssets: PortfolioAsset[] = [];

      stocks.forEach(stock => {
        const currentValue = stock.current_price ? stock.current_price * stock.quantity : 0;
        const investmentValue = stock.average_price * stock.quantity;
        const pnl = currentValue - investmentValue;
        const pnlPercentage = investmentValue > 0 ? (pnl / investmentValue) * 100 : 0;
        
        stocksBalance += currentValue;
        stocksInvestment += investmentValue;
        stocksPnl += pnl;
        
        stockAssets.push({
          name: stock.company_name,
          symbol: stock.tradingsymbol,
          type: 'stock',
          value: currentValue,
          quantity: stock.quantity,
          price: stock.current_price || 0,
          investment: investmentValue,
          pnl: pnl,
          pnlPercentage: pnlPercentage
        });
      });

      const stocksPnlPercentage = stocksInvestment > 0 ? (stocksPnl / stocksInvestment) * 100 : 0;
      
      setMetrics(prev => {
        const hasCryptoData = prev.dataAvailable.crypto;
        const totalBalance = stocksBalance + (hasCryptoData ? prev.cryptoBalance : 0);
        const totalInvestment = stocksInvestment + (hasCryptoData ? prev.cryptoInvestment : 0);
        const totalPnl = stocksPnl + (hasCryptoData ? prev.cryptoPnl : 0);
        const totalPnlPercentage = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

        const newMetrics = {
          ...prev,
          totalBalance,
          totalInvestment,
          totalPnl,
          totalPnlPercentage,
          stocksBalance,
          stocksInvestment,
          stocksPnl,
          stocksPnlPercentage,
          assetAllocation: [
            { type: 'stock', value: stocksBalance, percentage: totalBalance > 0 ? (stocksBalance / totalBalance) * 100 : 0 },
            ...(hasCryptoData 
              ? [{ type: 'crypto', value: prev.cryptoBalance, percentage: totalBalance > 0 ? (prev.cryptoBalance / totalBalance) * 100 : 0 }]
              : [])
          ],
          topHoldings: [
            ...stockAssets,
            ...(hasCryptoData ? prev.topHoldings.filter(a => a.type === 'crypto') : [])
          ].sort((a, b) => b.value - a.value).slice(0, 10),
          dataAvailable: { ...prev.dataAvailable, stocks: true }
        };
        
        console.log("Updated metrics with stocks:", newMetrics);
        return newMetrics;
      });
      
    } catch (err) {
      console.error("Failed to process stocks:", err);
      setError(`Stocks Error: ${(err as Error).message}`);
    } finally {
      // Only wait for crypto if we have crypto assets to process
      const shouldWaitForCrypto = aggregatedAssets && aggregatedAssets.length > 0;
      setLoading(shouldWaitForCrypto ? cryptoLoading : false);
      console.groupEnd();
    }
  }, [stocks, stocksLoading, stocksError, aggregatedAssets, cryptoLoading]);

  // Process crypto data
  useEffect(() => {
    if (cryptoLoading || !aggregatedAssets) return;

    console.group("[Dashboard] Processing crypto data");
    try {
      if (cryptoError) {
        console.error("Crypto error:", cryptoError);
        throw new Error(cryptoError);
      }

      if (aggregatedAssets.length === 0) {
        console.log("No crypto data available");
        setMetrics(prev => ({
          ...prev,
          dataAvailable: { ...prev.dataAvailable, crypto: false }
        }));
        return;
      }

      console.log(`Processing ${aggregatedAssets.length} crypto assets`);
      
      const cryptoBalance = cryptoMetrics.totalBalance;
      const cryptoInvestment = cryptoMetrics.totalInvested;
      const cryptoPnl = cryptoMetrics.totalReturn;
      const cryptoPnlPercentage = cryptoMetrics.totalReturnPercentage;
      
      const cryptoAssets: PortfolioAsset[] = aggregatedAssets.map(asset => {
        const currentPrice = prices[asset.symbol] || 0;
        const currentValue = currentPrice * asset.totalQuantity;
        const investmentValue = asset.avgBuyPrice * asset.totalQuantity;
        const pnl = currentValue - investmentValue;
        const pnlPercentage = investmentValue > 0 ? (pnl / investmentValue) * 100 : 0;
        
        return {
          name: asset.symbol,
          symbol: asset.symbol,
          type: 'crypto',
          value: currentValue,
          quantity: asset.totalQuantity,
          price: currentPrice,
          investment: investmentValue,
          pnl: pnl,
          pnlPercentage: pnlPercentage
        };
      });
      
      setMetrics(prev => {
        const hasStocksData = prev.dataAvailable.stocks;
        const totalBalance = (hasStocksData ? prev.stocksBalance : 0) + cryptoBalance;
        const totalInvestment = (hasStocksData ? prev.stocksInvestment : 0) + cryptoInvestment;
        const totalPnl = (hasStocksData ? prev.stocksPnl : 0) + cryptoPnl;
        const totalPnlPercentage = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

        const newMetrics = {
          ...prev,
          totalBalance,
          totalInvestment,
          totalPnl,
          totalPnlPercentage,
          cryptoBalance,
          cryptoInvestment,
          cryptoPnl,
          cryptoPnlPercentage,
          assetAllocation: [
            { type: 'crypto', value: cryptoBalance, percentage: totalBalance > 0 ? (cryptoBalance / totalBalance) * 100 : 0 },
            ...(hasStocksData 
              ? [{ type: 'stock', value: prev.stocksBalance, percentage: totalBalance > 0 ? (prev.stocksBalance / totalBalance) * 100 : 0 }]
              : [])
          ],
          topHoldings: [
            ...cryptoAssets,
            ...(hasStocksData ? prev.topHoldings.filter(a => a.type === 'stock') : [])
          ].sort((a, b) => b.value - a.value).slice(0, 10),
          dataAvailable: { ...prev.dataAvailable, crypto: true }
        };
        
        console.log("Updated metrics with crypto:", newMetrics);
        return newMetrics;
      });
      
    } catch (err) {
      console.error("Failed to process crypto:", err);
      setError(`Crypto Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  }, [aggregatedAssets, cryptoMetrics, prices, cryptoLoading, cryptoError]);

  // Error handling effect
  useEffect(() => {
    if (stocksError || cryptoError) {
      const errorMsg = stocksError || cryptoError;
      console.error("Context error detected:", errorMsg);
      setError(errorMsg);
      setLoading(false);
    }
  }, [stocksError, cryptoError]);

  // Loading timeout safety - reduced to 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Loading timeout reached (10s)");
        setError("Data loading is taking longer than expected");
        // Don't set loading to false - let the data processes complete
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading]);

  // Reset on refresh
  useEffect(() => {
    console.log("[Dashboard] Resetting state due to refresh");
    setMetrics({
      ...defaultMetrics,
      dataAvailable: { stocks: false, crypto: false }
    });
    setLoading(true);
    setError(null);
  }, [lastRefresh]);

  // Get formatted metrics
  const getFormattedMetrics = useCallback(() => {
    return {
      totalBalance: formatCurrency(metrics.totalBalance),
      totalInvestment: formatCurrency(metrics.totalInvestment),
      totalPnl: formatCurrency(metrics.totalPnl),
      totalPnlPercentage: `${metrics.totalPnlPercentage >= 0 ? '+' : ''}${Math.abs(metrics.totalPnlPercentage).toFixed(2)}%`,
      stocksBalance: formatCurrency(metrics.stocksBalance),
      stocksInvestment: formatCurrency(metrics.stocksInvestment),
      stocksPnl: formatCurrency(metrics.stocksPnl),
      stocksPnlPercentage: `${metrics.stocksPnlPercentage >= 0 ? '+' : ''}${Math.abs(metrics.stocksPnlPercentage).toFixed(2)}%`,
      cryptoBalance: formatCurrency(metrics.cryptoBalance),
      cryptoInvestment: formatCurrency(metrics.cryptoInvestment),
      cryptoPnl: formatCurrency(metrics.cryptoPnl),
      cryptoPnlPercentage: `${metrics.cryptoPnlPercentage >= 0 ? '+' : ''}${Math.abs(metrics.cryptoPnlPercentage).toFixed(2)}%`,
    };
  }, [metrics, formatCurrency]);

  // Final loading state calculation
  const finalLoadingState = useMemo(() => {
    // We're done loading when:
    // 1. Stocks are loaded (or not needed)
    // 2. Crypto is loaded (or not needed)
    const stocksReady = !stocksLoading && metrics.dataAvailable.stocks;
    const cryptoReady = (!cryptoLoading && metrics.dataAvailable.crypto) || 
                       (aggregatedAssets && aggregatedAssets.length === 0);
    
    const stillLoading = !stocksReady || !cryptoReady;
    
    console.log("[Dashboard] Loading state calculation:", {
      stocksReady,
      cryptoReady,
      finalState: stillLoading
    });
    
    return stillLoading;
  }, [stocksLoading, cryptoLoading, metrics.dataAvailable, aggregatedAssets]);

  const contextValue = useMemo(() => ({
    metrics,
    loading: finalLoadingState,
    error,
    formatCurrency,
    getFormattedMetrics,
    refreshData
  }), [metrics, finalLoadingState, error, formatCurrency, getFormattedMetrics, refreshData]);

  console.log("[Dashboard] Current state:", {
    metrics,
    loading: contextValue.loading,
    error,
    stocksLoading,
    cryptoLoading,
    dataAvailable: metrics.dataAvailable
  });

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};