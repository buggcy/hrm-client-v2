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

export const description = 'An area chart with a legend';

const chartData = [
  { month: 'January', approved: 186, rejected: 80, cancelled: 20 },
  { month: 'February', approved: 305, rejected: 200, cancelled: 50 },
  { month: 'March', approved: 237, rejected: 120, cancelled: 30 },
  { month: 'April', approved: 73, rejected: 190, cancelled: 40 },
  { month: 'May', approved: 209, rejected: 130, cancelled: 10 },
  { month: 'June', approved: 214, rejected: 140, cancelled: 30 },
  { month: 'July', approved: 273, rejected: 180, cancelled: 20 },
  { month: 'August', approved: 303, rejected: 220, cancelled: 40 },
  { month: 'September', approved: 331, rejected: 240, cancelled: 50 },
  { month: 'October', approved: 267, rejected: 160, cancelled: 30 },
  { month: 'November', approved: 189, rejected: 100, cancelled: 20 },
  { month: 'December', approved: 150, rejected: 50, cancelled: 10 },
];

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

export function LeavesTrendChart() {
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
