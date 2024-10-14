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

import { LeaveTrendChartData } from '@/types/hr-leave-list.types';

export const description = 'An area chart with a legend';
const chartConfig = {
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-1))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-2))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface LeaveTrendChartProps {
  chartData: LeaveTrendChartData[];
}

export function LeavesTrendChart({ chartData }: LeaveTrendChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Leaves Over Time</CardTitle>
        <CardDescription>
          Showing total leave requests for the last 6 months
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
              dataKey="rejected"
              type="natural"
              fill="var(--color-rejected)"
              fillOpacity={0.4}
              stroke="var(--color-rejected)"
              stackId="a"
            />
            <Area
              dataKey="cancelled"
              type="natural"
              fill="var(--color-cancelled)"
              fillOpacity={0.4}
              stroke="var(--color-cancelled)"
              stackId="a"
            />
            <Area
              dataKey="approved"
              type="natural"
              fill="var(--color-approved)"
              fillOpacity={0.4}
              stroke="var(--color-approved)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
