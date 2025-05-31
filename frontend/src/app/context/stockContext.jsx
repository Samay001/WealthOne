"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import stockData from '@/data/sample/stock.json';
import axios from "axios";

const StockContext = createContext({})

export const StockProvider = ({ children }) => {
  const [cmpPrices, setCmpPrices] = useState({})
  const [totalStockBalance, setTotalStockBalance] = useState(0)
  const [totalStockInvestment, setTotalStockInvestment] = useState(0)
  const [totalStockReturn, setTotalStockReturn] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [dataTimestamp, setDataTimestamp] = useState(null)

  // Helper function to fetch single stock price - eliminates code duplication
  const fetchSingleStockPrice = useCallback(async (symbol) => {
    const response = await axios.get(
      `https://wealth-one-nine.vercel.app/api/v1/stock?name=${symbol.toLowerCase()}`
    );
    const nsePrice = parseFloat(response.data.currentPrice.NSE);
    
    if (isNaN(nsePrice)) {
      throw new Error(`Invalid price data for ${symbol}`);
    }
    
    return nsePrice;
  }, []);

  // Calculate totals whenever CMP prices change
  useEffect(() => {
    let totalInvestment = 0;
    let totalBalance = 0;

    stockData.forEach((stock) => {
      const cmp = cmpPrices[stock.symbol];
      const investment = stock.price * stock.quantity;
      const currentValue = cmp ? cmp * stock.quantity : 0;

      totalInvestment += investment;
      totalBalance += currentValue;
    });

    setTotalStockInvestment(Math.round(totalInvestment));
    setTotalStockBalance(Math.round(totalBalance));
    setTotalStockReturn(
      totalInvestment > 0
        ? ((totalBalance - totalInvestment) / totalInvestment) * 100
        : 0
    );
  }, [cmpPrices]);

  // Fetch all stock CMP prices from API
  const fetchAllCmpPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    const updatedPrices = {};
    const errors = [];

    for (const stock of stockData) {
      try {
        const price = await fetchSingleStockPrice(stock.symbol);
        updatedPrices[stock.symbol] = price;
      } catch (error) {
        console.error(`Failed to fetch CMP for ${stock.symbol}`, error);
        errors.push(`Failed to fetch ${stock.symbol}`);
      }
    }

    setCmpPrices(updatedPrices);
    const timestamp = new Date();
    setLastUpdated(timestamp);
    setDataTimestamp(timestamp.getTime());

    if (errors.length > 0) {
      setError(`Some stocks failed to update: ${errors.join(", ")}`);
    }

    setLoading(false);
  }, [fetchSingleStockPrice]);

  // Fetch individual stock price
  const fetchStockPrice = useCallback(async (symbol) => {
    try {
      const price = await fetchSingleStockPrice(symbol);
      
      setCmpPrices(prev => ({
        ...prev,
        [symbol]: price
      }));
      
      return price;
    } catch (error) {
      console.error(`Failed to fetch CMP for ${symbol}`, error);
      throw error;
    }
  }, [fetchSingleStockPrice]);

  // Get all stock data with calculated values
  const getStockData = useCallback(() => {
    return stockData.map((stock) => {
      const cmp = cmpPrices[stock.symbol];
      const investment = stock.price * stock.quantity;
      const currentValue = cmp ? cmp * stock.quantity : null;
      const returnAmount = currentValue !== null ? currentValue - investment : null;
      const returnPercentage = investment > 0 && currentValue !== null 
        ? ((currentValue - investment) / investment) * 100 
        : null;

      return {
        ...stock,
        cmp,
        investment: Math.round(investment),
        currentValue: currentValue !== null ? Math.round(currentValue) : null,
        returnAmount: returnAmount !== null ? Math.round(returnAmount) : null,
        returnPercentage,
        hasCurrentData: cmp !== undefined
      };
    });
  }, [cmpPrices]);

  // Get stock by symbol
  const getStockBySymbol = useCallback((symbol) => {
    const stockInfo = stockData.find(stock => stock.symbol === symbol);
    if (!stockInfo) return null;

    const cmp = cmpPrices[symbol];
    const investment = stockInfo.price * stockInfo.quantity;
    const currentValue = cmp ? cmp * stockInfo.quantity : null;
    const returnAmount = currentValue !== null ? currentValue - investment : null;
    const returnPercentage = investment > 0 && currentValue !== null 
      ? ((currentValue - investment) / investment) * 100 
      : null;

    return {
      ...stockInfo,
      cmp,
      investment: Math.round(investment),
      currentValue: currentValue !== null ? Math.round(currentValue) : null,
      returnAmount: returnAmount !== null ? Math.round(returnAmount) : null,
      returnPercentage,
      hasCurrentData: cmp !== undefined
    };
  }, [cmpPrices]);

  // Clear all data
  const clearData = useCallback(() => {
    setCmpPrices({});
    setTotalStockBalance(0);
    setTotalStockInvestment(0);
    setTotalStockReturn(0);
    setError(null);
    setLastUpdated(null);
    setDataTimestamp(null);
  }, []);

  // Check if data is stale (older than 15 minutes)
  const isDataStale = useCallback(() => {
    if (!dataTimestamp) return true;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - dataTimestamp > fifteenMinutes;
  }, [dataTimestamp]);

  // Initialize on mount - fetch CMP prices
  useEffect(() => {
    fetchAllCmpPrices();
  }, [fetchAllCmpPrices]);

  const value = {
    // State
    cmpPrices,
    totalStockBalance,
    totalStockInvestment,
    totalStockReturn,
    loading,
    error,
    lastUpdated,
    
    // Methods
    fetchAllCmpPrices,
    fetchStockPrice,
    getStockData,
    getStockBySymbol,
    clearData,
    isDataStale,
    
    // Raw stock data
    stockData
  }

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
}