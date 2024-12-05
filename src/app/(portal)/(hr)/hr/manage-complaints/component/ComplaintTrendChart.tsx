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

import { ComplaintTrendChartData } from '@/types/complaint.types';

export const description = 'An area chart with a legend';
const chartConfig = {
  resolved: {
    label: 'Resolved',
    color: 'hsl(var(--chart-1))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  canceled: {
    label: 'Canceled',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface ChartProps {
  chartData: ComplaintTrendChartData[];
}

export function ComplaintTrendChart({ chartData }: ChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm">Complaints Over Time</CardTitle>
        <CardDescription className="text-xs">
          Showing total complaints for this year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
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
              dataKey="canceled"
              type="natural"
              fill="var(--color-canceled)"
              fillOpacity={0.4}
              stroke="var(--color-canceled)"
              stackId="a"
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="var(--color-pending)"
              fillOpacity={0.4}
              stroke="var(--color-pending)"
              stackId="a"
            />
            <Area
              dataKey="resolved"
              type="natural"
              fill="var(--color-resolved)"
              fillOpacity={0.4}
              stroke="var(--color-resolved)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
