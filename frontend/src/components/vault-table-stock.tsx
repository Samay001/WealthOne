// components/vault-table-stock.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useStocks } from "@/app/context/stockContext";

interface VaultTableProps {
  refreshStockPrice?: (symbol: string) => Promise<void>;
  refreshing?: string | null;
}

export function VaultTable({ refreshStockPrice, refreshing }: VaultTableProps) {
  const { stocks, formatCurrency } = useStocks();
  const [activeExchange, setActiveExchange] = useState<string>("NSE");
  const [refreshingStock, setRefreshingStock] = useState<string | null>(null);

  // Filter stocks by active exchange
  const filteredStocks = stocks.filter(
    (stock) => stock.exchange === activeExchange
  );

  // Handle refresh for individual stock
  const handleRefresh = async (symbol: string) => {
    if (!refreshStockPrice) return;

    setRefreshingStock(symbol);
    try {
      await refreshStockPrice(symbol);
    } finally {
      setRefreshingStock(null);
    }
  };

  // Calculate profit/loss for stock
  const calculateStockPnL = (stock: any) => {
    const currentPrice = stock.current_price || stock.last_price;
    const currentValue = currentPrice * stock.quantity;
    const investment = stock.average_price * stock.quantity;
    return currentValue - investment;
  };

  // Calculate profit/loss percentage for stock
  const calculateStockPnLPercentage = (stock: any) => {
    const currentPrice = stock.current_price || stock.last_price;
    const investment = stock.average_price;
    if (investment === 0) return 0;
    return ((currentPrice - investment) / investment) * 100;
  };

  return (
    <div className="rounded-xl border border-white/20 bg-[#09090B] p-6">
      <div className="flex flex-col space-y-1.5 pb-4">
        <h2 className="text-lg font-semibold text-white">Your Stocks</h2>
        <p className="text-sm text-white/50">
          Overview of your stock portfolio
        </p>
      </div>
      {/* <div className="mb-4 flex gap-2">
        <Button 
          size="sm" 
          variant={activeExchange === "NSE" ? "default" : "outline"}
          onClick={() => setActiveExchange("NSE")}
          className={activeExchange === "NSE" ? "bg-white text-black" : "text-white border-white/20"}
        >
          NSE
        </Button>
        <Button 
          size="sm" 
          variant={activeExchange === "BSE" ? "default" : "outline"}
          onClick={() => setActiveExchange("BSE")}
          className={activeExchange === "BSE" ? "bg-white text-black" : "text-white border-white/20"}
        >
          BSE
        </Button>
      </div> */}
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 hover:bg-white/5">
              <TableHead className="text-white">Stock</TableHead>
              <TableHead className="text-white">Quantity</TableHead>
              <TableHead className="text-right text-white">
                Avg. Price
              </TableHead>
              <TableHead className="text-right text-white">
                Current Price
              </TableHead>
              <TableHead className="text-right text-white">
                Investment
              </TableHead>
              <TableHead className="text-right text-white">P&L</TableHead>
              <TableHead className="text-right text-white"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => {
                const currentPrice = stock.current_price || stock.last_price;
                const pnl = calculateStockPnL(stock);
                const pnlPercentage = calculateStockPnLPercentage(stock);
                const isPnlPositive = pnl >= 0;

                return (
                  <TableRow
                    key={stock.isin}
                    className="border-white/20 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white flex items-center gap-2">
                      {stock.logo_svg_url && (
                        <img
                          src={stock.logo_svg_url}
                          alt={stock.company_name}
                          className="h-6 w-6 rounded"
                        />
                      )}
                      <div>
                        <div>{stock.trading_symbol}</div>
                        <div className="text-xs text-white/50">
                          {stock.company_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {stock.quantity}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(stock.average_price)}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(currentPrice)}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {formatCurrency(stock.average_price * stock.quantity)}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        isPnlPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      <div>{formatCurrency(pnl)}</div>
                      <div className="text-xs">
                        {isPnlPositive ? "+" : ""}
                        {pnlPercentage.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {refreshStockPrice && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => handleRefresh(stock.trading_symbol)}
                          disabled={
                            refreshingStock === stock.trading_symbol ||
                            refreshing === "all"
                          }
                        >
                          {refreshingStock === stock.trading_symbol
                            ? "Refreshing..."
                            : "Refresh"}
                        </Button>
                      )}
                    </TableCell>
                    
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-white/50"
                >
                  No stocks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
