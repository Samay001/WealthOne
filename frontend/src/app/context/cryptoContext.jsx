"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import cryptoData from "@/data/sample/crypto.json";
import axios from "axios";

// Create the context
const CryptoContext = createContext();

// Custom hook to use the crypto context
export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
};

// Provider component
export const CryptoProvider = ({ children }) => {
  const [cmpPrices, setCmpPrices] = useState({});
  const [cmpVisible, setCmpVisible] = useState(false);
  const [totalCryptoBalance, setTotalCryptoBalance] = useState(0);
  const [totalCryptoInvestment, setTotalCryptoInvestment] = useState(0);
  const [totalCryptoReturn, setTotalCryptoReturn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved prices from localStorage on mount
  useEffect(() => {
    const savedCmp = localStorage.getItem("cmpPrices");
    if (savedCmp) {
      try {
        const parsed = JSON.parse(savedCmp);
        setCmpPrices(parsed);
        setCmpVisible(true);
      } catch (error) {
        console.error("Failed to parse saved CMP data", error);
        localStorage.removeItem("cmpPrices");
      }
    }
  }, []);

  // Calculate totals whenever prices change
  useEffect(() => {
    if (!cmpVisible) return;

    let totalInvestment = 0;
    let totalBalance = 0;

    cryptoData.forEach((crypto) => {
      const cmp = cmpPrices[crypto.name]?.inr;
      const investment = crypto.price * crypto.quantity;
      const currentValue = cmp ? cmp * crypto.quantity : 0;

      totalInvestment += investment;
      totalBalance += currentValue;
    });

    setTotalCryptoInvestment(Math.round(totalInvestment));
    setTotalCryptoBalance(Math.round(totalBalance));
    setTotalCryptoReturn(
      totalInvestment > 0 ? ((totalBalance - totalInvestment) / totalInvestment) * 100 : 0
    );
  }, [cmpPrices, cmpVisible]);

  // Fetch current market prices
  const fetchCmpData = useCallback(async () => {
    const symbols = cryptoData.map((crypto) => crypto.name).join(",");
    const url = `http://localhost:8080/api/crypto/prices?ids=${symbols}&vs_currencies=inr`;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      setCmpPrices(response.data);
      setCmpVisible(true);
      localStorage.setItem("cmpPrices", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch CMP data", error);
      setError("Failed to fetch current market prices");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get individual crypto data with calculated values
  const getCryptoData = useCallback(() => {
    return cryptoData.map((crypto) => {
      const cmp = cmpPrices[crypto.name]?.inr;
      const investment = Math.round(crypto.price * crypto.quantity);
      const currentValue = cmp ? Math.round(cmp * crypto.quantity) : null;
      const returnAmount = currentValue !== null ? currentValue - investment : null;
      const returnPercentage = investment > 0 && currentValue !== null 
        ? ((currentValue - investment) / investment) * 100 
        : null;

      return {
        ...crypto,
        cmp,
        investment,
        currentValue,
        returnAmount,
        returnPercentage,
        hasCurrentData: cmpVisible && cmp !== undefined
      };
    });
  }, [cmpPrices, cmpVisible]);

  // Clear all data
  const clearData = useCallback(() => {
    setCmpPrices({});
    setCmpVisible(false);
    setTotalCryptoBalance(0);
    setTotalCryptoInvestment(0);
    setTotalCryptoReturn(0);
    setError(null);
    localStorage.removeItem("cmpPrices");
  }, []);

  const value = {
    // State
    cmpPrices,
    cmpVisible,
    totalCryptoBalance,
    totalCryptoInvestment,
    totalCryptoReturn,
    isLoading,
    error,
    
    // Methods
    fetchCmpData,
    getCryptoData,
    clearData,
    
    // Raw crypto data
    cryptoData
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
};