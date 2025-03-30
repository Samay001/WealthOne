"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function LineComponent() {
  return (
    <Card className="flex flex-col border-white/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base">Line Chart - Multiple</CardTitle>
        <CardDescription className="text-xs sm:text-sm">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full h-full min-h-[200px] sm:min-h-[250px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart 
              data={chartData}
              margin={{
                left: 8,
                right: 8,
                top: 8,
                bottom: 8,
              }}
            >
              <CartesianGrid 
                vertical={false} 
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <XAxis 
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                fontSize={12}
              />
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent />} 
              />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-start gap-1 sm:gap-2 text-xs sm:text-sm">
          <div className="grid gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}