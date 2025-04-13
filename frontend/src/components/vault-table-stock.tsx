import React, { useEffect } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStocks } from "@/app/context/stockContext";
import data from "@/data/sample/stock.json";

// Define types for the stock data
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
  current_price?: number;
  investment?: string;
  balance?: string;
  pnl_string?: string;
  percent_change?: string;
  start_date?: string;
  industry?: string | null;
}

interface StockDataResponse {
  data: StockData[];
}

export function VaultTable() {
  const { stocks, loading, error, updateStockData, formatCurrency } = useStocks();
  const initialVaults: StockData[] = (data as StockDataResponse).data;

  // When component mounts, update stock data with latest prices
  useEffect(() => {
    updateStockData(initialVaults);
    
    // Set up polling to refresh data periodically
    const intervalId = setInterval(() => {
      updateStockData(initialVaults);
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [updateStockData]);

  if (loading && stocks.length === 0) {
    return <div className="p-4 text-center">Loading stock data...</div>;
  }

  if (error && stocks.length === 0) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // Use stocks from context if available, otherwise use initial data
  const vaults = stocks.length > 0 ? stocks : initialVaults;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black border-white/30">
          <TableHead className="text-gray-400 font-bold">Stock</TableHead>
          <TableHead className="text-gray-400 font-bold">Position</TableHead>
          <TableHead className="text-gray-400 font-bold">Your Price (₹)</TableHead>
          <TableHead className="text-gray-400 font-bold">Current Price (₹)</TableHead>
          <TableHead className="text-gray-400 font-bold">Quantity</TableHead>
          <TableHead className="text-gray-400 font-bold">Investment</TableHead>
          <TableHead className="text-gray-400 font-bold">Current Value</TableHead>
          <TableHead className="text-gray-400 font-bold">Start date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault) => {
          const currentPrice = vault.current_price || vault.last_price;
          const investmentValue = vault.investment 
            ? parseFloat(vault.investment.replace(/[₹,]/g, '')) 
            : vault.average_price * vault.quantity;
          const currentValue = currentPrice * vault.quantity;
          const profitLoss = currentValue - investmentValue;
          const profitLossPercentage = investmentValue > 0 
            ? (profitLoss / investmentValue) * 100 
            : parseFloat(vault.percent_change || '0');

          return (
            <TableRow key={vault.isin} className="hover:bg-[#131316] border-white/20">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <img src={vault.logo_svg_url} alt={vault.company_name} />
                  </Avatar>
                  <div>
                    <div className="font-medium">{vault.company_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {vault.tradingsymbol}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                    vault.position === "EQUITY" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {vault.position}
                </span>
              </TableCell>
              
              <TableCell>
                {formatCurrency ? formatCurrency(vault.average_price) : `₹${vault.average_price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`}
              </TableCell>
              
              <TableCell>
                {formatCurrency ? formatCurrency(currentPrice) : `₹${currentPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`}
              </TableCell>
              
              <TableCell>
                {vault.quantity.toLocaleString("en-IN")}
              </TableCell>
              
              <TableCell>
                {vault.investment || (formatCurrency ? formatCurrency(investmentValue) : `₹${investmentValue.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`)}
              </TableCell>
              
              <TableCell>
                <div>
                  {vault.balance || (formatCurrency ? formatCurrency(currentValue) : `₹${currentValue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}`)}
                </div>
                <div
                  className={`text-xs ${
                    profitLossPercentage >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {profitLossPercentage >= 0 ? "+" : ""}
                  {profitLossPercentage.toFixed(2)}%
                </div>
              </TableCell>
              
              <TableCell>{vault.start_date}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}