'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { ChartData, ChartProps } from '../types';

export const description = 'A multiple bar chart';

const chartData: ChartData[] = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 205, mobile: 100 },
  { month: 'March', desktop: 237, mobile: 250 },
  { month: 'April', desktop: 73, mobile: 90 },
  { month: 'May', desktop: 209, mobile: 30 },
  { month: 'June', desktop: 214, mobile: 40 },
];

const chartConfig: ChartProps['config'] = {
  desktop: {
    label: 'Desktop',
    color: '#fdddf1',
  },
  mobile: {
    label: 'Mobile',
    color: '#e2dbf6',
  },
};

export function BChart() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Number of Employees in Each Department
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <YAxis
              dataKey="mobile"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
