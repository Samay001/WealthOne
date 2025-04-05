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
    state: "SPOT",
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
    state: "SPOT",
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
    state: "SPOT",
    startDate: "21.01.2023",
    liquidity: "low",
  },
]

export function VaultTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black border-white/30">
          <TableHead className="text-gray-400 font-bold">Coins</TableHead>
          <TableHead className="text-gray-400 font-bold">Position</TableHead>
          <TableHead className="text-gray-400 font-bold">Price</TableHead>
          <TableHead className="text-gray-400 font-bold">Investment</TableHead>
          <TableHead className="text-gray-400 font-bold">%Change</TableHead>
          <TableHead className="text-gray-400 font-bold">Balance</TableHead>
          <TableHead className="text-gray-400 font-bold">Market Cap</TableHead>
          <TableHead className="text-gray-400 font-bold">Start date</TableHead>
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
            
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  vault.state === "SPOT" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                }`}
              >
                {vault.state}
              </span>
            </TableCell>
            <TableCell>{vault.balance}</TableCell>
            <TableCell>{vault.balance}</TableCell>
            <TableCell className="text-green-500">{vault.daily}</TableCell>
            <TableCell>{vault.balance}</TableCell>
            <TableCell>{vault.balance}</TableCell>
            
            <TableCell>{vault.startDate}</TableCell>
    
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

