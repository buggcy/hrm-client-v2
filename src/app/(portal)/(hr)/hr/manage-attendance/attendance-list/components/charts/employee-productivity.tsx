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

import { Card3Data } from '@/types/attendance-list.types';

export const description = 'A simple area chart';

const chartConfig = {
  productivity: {
    label: 'Productivity',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface EmployeeProductivityChartProps {
  data?: Card3Data;
}

export function EmployeeProductivityChart({
  data,
}: EmployeeProductivityChartProps) {
  const chartData = [
    { month: 'January', productivity: data?.January || 0 },
    { month: 'February', productivity: data?.February || 0 },
    { month: 'March', productivity: data?.March || 0 },
    { month: 'April', productivity: data?.April || 0 },
    { month: 'May', productivity: data?.May || 0 },
    { month: 'June', productivity: data?.June || 0 },
    { month: 'July', productivity: data?.July || 0 },
    { month: 'August', productivity: data?.August || 0 },
    { month: 'September', productivity: data?.September || 0 },
    { month: 'October', productivity: data?.October || 0 },
    { month: 'November', productivity: data?.November || 0 },
    { month: 'December', productivity: data?.December || 0 },
  ];

  const currentYear = new Date().getFullYear();
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Employee Productivity</CardTitle>
        <CardDescription className="text-xs">{currentYear}</CardDescription>
      </CardHeader>
      <CardContent className="md:size-full md:max-h-[310px]">
        <ChartContainer
          config={chartConfig}
          className="size-full max-h-[350px] min-h-[150px] overflow-hidden md:max-h-[310px]"
        >
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="productivity"
              type="monotone"
              fill="var(--color-productivity)"
              fillOpacity={0.4}
              stroke="var(--color-productivity)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
