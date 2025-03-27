import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const vaults = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$13,643.21",
    daily: "+$213.8",
    balance: "$13,954.04",
    apy: "8.56%",
    state: "Fixed",
    startDate: "05.10.2023",
    liquidity: "high",
  },
  {
    name: "USDT",
    symbol: "USDT",
    price: "$1.00",
    daily: "+$45.1",
    balance: "$3,954.04",
    apy: "5.44%",
    state: "Fixed",
    startDate: "12.03.2023",
    liquidity: "medium",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$2,123.87",
    daily: "+$13.5",
    balance: "$3,954.04",
    apy: "4.12%",
    state: "Flexible",
    startDate: "21.01.2023",
    liquidity: "low",
  },
]

export function VaultTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black border-white/30">
          <TableHead className="text-gray-400 font-bold">Vault</TableHead>
          <TableHead className="text-gray-400 font-bold">Daily</TableHead>
          <TableHead className="text-gray-400 font-bold">Balance ↓</TableHead>
          <TableHead className="text-gray-400 font-bold">APY ↓</TableHead>
          <TableHead className="text-gray-400 font-bold">State</TableHead>
          <TableHead className="text-gray-400 font-bold">Start date</TableHead>
          <TableHead className="text-gray-400 font-bold">Liquidity</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault) => (
          <TableRow key={vault.symbol} className="hover:bg-[#131316] border-white/20" >
            <TableCell className="font-medium ">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <img src={"https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=003"} alt={vault.name} />
                </Avatar>
                <div>
                  <div className="font-medium">{vault.name}</div>
                  <div className="text-xs text-muted-foreground">{vault.price}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-green-500">{vault.daily}</TableCell>
            <TableCell>{vault.balance}</TableCell>
            <TableCell>{vault.apy}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  vault.state === "Fixed" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                }`}
              >
                {vault.state}
              </span>
            </TableCell>
            <TableCell>{vault.startDate}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-3 rounded-full ${
                      i < (vault.liquidity === "high" ? 3 : vault.liquidity === "medium" ? 2 : 1)
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </TableCell>
    
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

