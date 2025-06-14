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

  // Memoize getCryptoData to avoid re-running calculations unnecessarily
  const getCryptoData = useCallback(() => {
    return cryptoData.map((crypto) => {
      // Strip "INR" from the symbol to match the keys in cmpPrices (e.g., "BTC")
      const baseSymbol = crypto.symbol.replace('INR', '');
      const cmp = cmpPrices[baseSymbol]?.inr;
      const investment = Math.round(parseFloat(crypto.price) * parseFloat(crypto.quantity));
      const currentValue = cmp ? Math.round(cmp * parseFloat(crypto.quantity)) : null;
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

  // Calculate totals whenever prices or data change
  useEffect(() => {
    const data = getCryptoData();
    const { totalInvestment, totalBalance } = data.reduce(
      (acc, crypto) => {
        acc.totalInvestment += crypto.investment;
        acc.totalBalance += crypto.currentValue ?? crypto.investment;
        return acc;
      },
      { totalInvestment: 0, totalBalance: 0 }
    );

    setTotalCryptoInvestment(Math.round(totalInvestment));
    setTotalCryptoBalance(Math.round(totalBalance));

    if (totalInvestment > 0) {
      const newReturn = ((totalBalance - totalInvestment) / totalInvestment) * 100;
      setTotalCryptoReturn(newReturn);
    } else {
      setTotalCryptoReturn(0);
    }
  }, [cmpPrices, cmpVisible, getCryptoData]);

  const fetchCmpData = useCallback(async () => {
    // Strip "INR" from each symbol before creating the API query string
    const symbols = cryptoData.map(c => c.symbol.replace('INR', '')).join(',');
    if (!symbols) {
        setError("No crypto symbols found in the data file.");
        return;
    }
    
    const url = `https://wealthone.onrender.com/api/crypto/prices?symbol=${symbols}&convert=INR`; 
    console.log("Fetching CMP data from URL:", url);

    setIsLoading(true);
    setError(null);

    try {
        const response = await axios.get(url);
        console.log("Received API response:", response);

        if (!response.data || !response.data.data) {
            console.error("API response is missing the 'data' field.", response.data);
            setError("Received an invalid response from the API.");
            setIsLoading(false);
            return;
        }

        const apiData = response.data.data;
        const formattedPrices = {};

        Object.keys(apiData).forEach(symbol => {
            const quote = apiData[symbol]?.quote?.INR;
            if (quote && quote.price) {
                formattedPrices[symbol] = {
                    inr: Math.round(quote.price)
                };
            } else {
                console.warn(`Price data for symbol '${symbol}' not found in API response.`);
            }
        });

        if (Object.keys(formattedPrices).length === 0) {
            console.error("Could not format any prices from the API response.", apiData);
            setError("Could not extract any prices. Check if symbols in your data match the API.");
        } else {
            console.log("Successfully formatted prices:", formattedPrices);
            setCmpPrices(formattedPrices);
            setCmpVisible(true);
            localStorage.setItem("cmpPrices", JSON.stringify(formattedPrices));
        }

    } catch (error) {
        console.error("Failed to fetch CMP data:", error);
        let errorMessage = "Failed to fetch market prices.";
        if (error.code === "ERR_NETWORK") {
            errorMessage += " This could be a CORS issue or the API server might be down. Check the browser console for details.";
        }
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }, []);

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
    cmpVisible,
    totalCryptoBalance,
    totalCryptoInvestment,
    totalCryptoReturn,
    isLoading,
    error,
    fetchCmpData,
    getCryptoData,
    clearData,
    cryptoData
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
};
