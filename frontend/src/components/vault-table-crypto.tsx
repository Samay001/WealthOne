import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import data from "@/data/sample/crypto.json"    

export function VaultTable() {
  
  const assets = data.assets;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black border-white/30">
          <TableHead className="text-gray-400 font-bold">Coins</TableHead>
          <TableHead className="text-gray-400 font-bold">Order Type</TableHead>
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
        {assets.map((vault) => (
          <TableRow key={vault.coin_image} className="hover:bg-[#131316] border-white/20" >
            <TableCell className="font-medium ">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <img src={vault.coin_image} alt={vault.market} />
                </Avatar>
                <div>
                  <div className="font-medium">{vault.market}</div>
                  <div className="text-xs text-muted-foreground">{vault.avg_price}</div>
                </div>
              </div>
            </TableCell>
            
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  vault.order_type === "limit_order" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                }`}
              >
                {vault.order_type}
              </span>
            </TableCell>
            <TableCell>{vault.avg_price}</TableCell>
            <TableCell>{(vault.total_quantity * vault.avg_price) + vault.fee_amount}</TableCell>
            <TableCell className="text-green-500">{"will update"}</TableCell>
            <TableCell>{(vault.total_quantity * vault.avg_price) + vault.fee_amount}</TableCell>
            <TableCell>{(vault.total_quantity * vault.avg_price) + vault.fee_amount}</TableCell>
            
            <TableCell>{vault.created_at}</TableCell>
    
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

