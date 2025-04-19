'use client';

import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import symbolData from "@/data/sample/crypto-mapping.json";
import { useVault } from "@/app/context/cryptoContext";
import Image from "next/image";

export function VaultTable() {
  const { aggregatedAssets, prices, loading, error } = useVault();

  if (loading) {
    return <div className="p-4 text-center">Loading prices...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black border-white/30">
          <TableHead className="text-gray-400 font-bold">Coin</TableHead>
          <TableHead className="text-gray-400 font-bold">Type</TableHead>
          <TableHead className="text-gray-400 font-bold">
            Current Price (₹)
          </TableHead>
          <TableHead className="text-gray-400 font-bold">
            Your Price (₹)
          </TableHead>
          <TableHead className="text-gray-400 font-bold">Quantity</TableHead>
          <TableHead className="text-gray-400 font-bold">
            Current Value
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {aggregatedAssets.map((asset) => {
          const currentPrice = prices[asset.symbol] || 0;
          const investment =
            asset.totalQuantity * asset.avgBuyPrice + asset.totalFee;
          const currentValue = asset.totalQuantity * currentPrice;
          const profitLoss = currentValue - investment;
          const profitLossPercentage =
            investment > 0 ? (profitLoss / investment) * 100 : 0;

          return (
            <TableRow
              key={asset.symbol}
              className="hover:bg-[#131316] border-white/20"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <Image
                      src={
                        (symbolData as Record<string, { name: string; svg_url: string }>)[asset.symbol]?.svg_url || "/placeholder.png"
                      }
                      alt={asset.symbol}
                    />
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {symbolData[asset.symbol as keyof typeof symbolData]?.name || asset.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {asset.symbol}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                    asset.order_type === "limit_order"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {asset.order_type.replace("_", " ")}
                </span>
              </TableCell>

              <TableCell>
                {currentPrice
                  ? `₹${currentPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}`
                  : "N/A"}
              </TableCell>

              <TableCell>
                ₹
                {asset.avgBuyPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>

              <TableCell>
                {asset.totalQuantity.toLocaleString("en-IN", {
                  maximumFractionDigits: 8,
                })}
              </TableCell>

              <TableCell>
                <div>
                  ₹
                  {currentValue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs ${
                    profitLoss >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {profitLoss >= 0 ? "+" : ""}
                  {profitLossPercentage.toFixed(2)}%
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}