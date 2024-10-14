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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A stacked area chart';

const chartData = [
  { month: 'January', assigned: 186, availed: 80 },
  { month: 'February', assigned: 305, availed: 200 },
  { month: 'March', assigned: 237, availed: 120 },
  { month: 'April', assigned: 73, availed: 190 },
  { month: 'May', assigned: 209, availed: 130 },
  { month: 'June', assigned: 214, availed: 140 },
  { month: 'July', assigned: 214, availed: 140 },
  { month: 'August', assigned: 214, availed: 140 },
  { month: 'September', assigned: 214, availed: 140 },
  { month: 'October', assigned: 214, availed: 140 },
  { month: 'November', assigned: 214, availed: 140 },
  { month: 'December', assigned: 214, availed: 140 },
];

const chartConfig = {
  assigned: {
    label: 'Assigned',
    color: 'hsl(var(--chart-1))',
  },
  availed: {
    label: 'Availed',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function PerkRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perk Assigned & Availed</CardTitle>
        <CardDescription>
          Showing total assigned & availed for the last year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
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
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="availed"
              type="natural"
              fill="var(--color-availed)"
              fillOpacity={0.4}
              stroke="var(--color-availed)"
              stackId="a"
            />
            <Area
              dataKey="assigned"
              type="natural"
              fill="var(--color-assigned)"
              fillOpacity={0.4}
              stroke="var(--color-assigned)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
