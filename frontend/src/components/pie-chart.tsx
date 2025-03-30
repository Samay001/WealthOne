"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function PieComponent() {
  return (
    <Card className="flex flex-col border-white/20 h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm sm:text-base">Pie Chart - Label List</CardTitle>
        <CardDescription className="text-xs sm:text-sm">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full h-full min-h-[200px] sm:min-h-[250px]">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="visitors" hideLabel />}
              />
              <Pie data={chartData} dataKey="visitors">
                <LabelList
                  dataKey="browser"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}