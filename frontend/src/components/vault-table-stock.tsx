import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import data from "@/data/sample/stock.json"


export function VaultTable() {
  const vaults = data.data;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black border-white/30">
          <TableHead className="text-gray-400 font-bold">Stock</TableHead>
          <TableHead className="text-gray-400 font-bold">Position</TableHead>
          <TableHead className="text-gray-400 font-bold">Price</TableHead>
          <TableHead className="text-gray-400 font-bold">Investment</TableHead>
          <TableHead className="text-gray-400 font-bold">%Change</TableHead>
          <TableHead className="text-gray-400 font-bold">Balance</TableHead>
          <TableHead className="text-gray-400 font-bold">PnL</TableHead>
          <TableHead className="text-gray-400 font-bold">Start date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault) => (
          <TableRow key={vault.logo_svg_url} className="hover:bg-[#131316] border-white/20" >
            <TableCell className="font-medium ">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <img src={vault.logo_svg_url} alt={vault.company_name} />
                </Avatar>
                <div>
                  <div className="font-medium">{vault.company_name}</div>
                  <div className="text-xs text-muted-foreground">{vault.last_price}</div>
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
            <TableCell>{vault.average_price}</TableCell>
            <TableCell>{vault.average_price * vault.quantity}</TableCell>
            <TableCell className="text-green-500">{"will do"}</TableCell>
            <TableCell>{vault.last_price * vault.quantity}</TableCell>
            <TableCell>{vault.pnl}</TableCell>
            
            <TableCell>{"will do"}</TableCell>
    
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

