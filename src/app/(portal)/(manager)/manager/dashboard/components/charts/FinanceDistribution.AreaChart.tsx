'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { month: 'January', cost: 186, profit: 80, revenue: 266 },
  { month: 'February', cost: 80, profit: 20, revenue: 100 },
  { month: 'March', cost: 100, profit: 40, revenue: 140 },
  { month: 'April', cost: 200, profit: 100, revenue: 300 },
  { month: 'May', cost: 140, profit: 60, revenue: 200 },
  { month: 'June', cost: 100, profit: 40, revenue: 140 },
  { month: 'July', cost: 200, profit: 100, revenue: 300 },
  { month: 'August', cost: 140, profit: 60, revenue: 200 },
  { month: 'September', cost: 100, profit: 40, revenue: 140 },
  { month: 'October', cost: 200, profit: 100, revenue: 300 },
  { month: 'November', cost: 140, profit: 60, revenue: 200 },
  { month: 'December', cost: 100, profit: 40, revenue: 140 },
];

const chartConfig = {
  cost: {
    label: 'Cost',
    color: 'hsl(var(--chart-3))',
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function FinanceDistribution() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Company Finances</CardTitle>
        <CardDescription>
          Showing the distribution of revenue, profit, and cost over the year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              stackId="a"
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="var(--color-profit)"
              fillOpacity={0.4}
              stroke="var(--color-profit)"
              stackId="a"
            />
            <Area
              dataKey="cost"
              type="natural"
              fill="var(--color-cost)"
              fillOpacity={0.4}
              stroke="var(--color-cost)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
