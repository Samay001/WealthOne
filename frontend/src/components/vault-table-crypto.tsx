import { useEffect, useState, useMemo } from "react";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import data from "@/data/sample/crypto.json";
import symbolData from "@/data/sample/crypto-mapping.json";
import axios from "axios";

// Define types for better TypeScript support
type Asset = {
  market: string;
  coin_image: string;
  order_type: string;
  avg_price: number;
  total_quantity: number;
  fee_amount: number;
  created_at: string;
};

type Prices = {
  [key: string]: number | null;
};

type SymbolMapping = {
  [key: string]: string;
};

type VaultTableProps = {
  onMetricsUpdate: (metrics: {
    totalBalance: number;
    totalInvested: number;
    totalReturn: number;
    totalReturnPercentage: number;
  }) => void;
};

export function VaultTable({ onMetricsUpdate }: VaultTableProps) {
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use useMemo to prevent assets from being recreated on each render
  const assets = useMemo(() => data.assets as Asset[], []);

  // Keep track of whether metrics have been sent to avoid multiple updates
  const [metricsSent, setMetricsSent] = useState(false);

  // Calculate and update metrics only when prices are updated and not already sent
  useEffect(() => {
    // Only calculate metrics when we have prices and they haven't been sent yet
    if (!loading && Object.keys(prices).length > 0 && !metricsSent) {
      const totalInvested = assets.reduce(
        (sum, asset) =>
          sum + asset.avg_price * asset.total_quantity + asset.fee_amount,
        0
      );

      const totalCurrent = assets.reduce(
        (sum, asset) =>
          sum + (prices[asset.market] || 0) * asset.total_quantity,
        0
      );

      const totalReturn = totalCurrent - totalInvested;
      const totalReturnPercentage =
        totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

      // Send metrics up to dashboard
      onMetricsUpdate({
        totalBalance: totalCurrent,
        totalInvested: totalInvested,
        totalReturn: totalReturn,
        totalReturnPercentage: totalReturnPercentage,
      });
      
      // Mark metrics as sent to prevent further updates
      setMetricsSent(true);
    }
  }, [prices, loading, onMetricsUpdate, assets, metricsSent]);

  // Fetch prices only once on component mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const newPrices: Prices = {};

        const uniqueMarkets = Array.from(
          new Set(assets.map((asset) => asset.market))
        );

        const requests = uniqueMarkets.map(async (market) => {
          // Use the symbolData mapping to get the correct cryptoId
          const cryptoId = (symbolData as SymbolMapping)[market];

          if (!cryptoId) {
            console.error(`No mapping found for market: ${market}`);
            newPrices[market] = null;
            return;
          }

          try {
            const response = await axios.get(
              `http://localhost:8080/api/crypto/prices`,
              {
                params: {
                  ids: cryptoId.toLowerCase(),
                  vs_currencies: "inr",
                },
                withCredentials: true,
              }
            );
            newPrices[market] =
              response.data?.[cryptoId.toLowerCase()]?.inr || null;
          } catch (err) {
            console.error(`Error fetching price for ${market}:`, err);
            newPrices[market] = null;
          }
        });

        // Wait for all requests to complete
        await Promise.all(requests);

        setPrices(newPrices);
        setError(null);
      } catch (err) {
        console.error("Error fetching prices:", err);
        setError("Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // Empty dependency array ensures this only runs once on mount
  }, []);

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
        {assets.map((asset) => {
          const currentPrice = prices[asset.market] || 0;
          const investment =
            asset.total_quantity * asset.avg_price + asset.fee_amount;
          const currentValue = asset.total_quantity * currentPrice;
          const profitLoss = currentValue - investment;
          const profitLossPercentage =
            investment > 0 ? (profitLoss / investment) * 100 : 0;

          return (
            <TableRow
              key={`${asset.market}-${asset.created_at}`}
              className="hover:bg-[#131316] border-white/20"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <img src={asset.coin_image} alt={asset.market} />
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {(symbolData as SymbolMapping)[asset.market] ||
                        asset.market}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {asset.market}
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
                {asset.avg_price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>

              <TableCell>
                {asset.total_quantity.toLocaleString("en-IN")}
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