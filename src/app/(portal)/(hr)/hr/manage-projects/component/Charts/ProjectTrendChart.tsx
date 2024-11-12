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

import { TrendChartData } from '@/types/project-department.types';

export const description = 'An area chart with a legend';
const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-1))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-3))',
  },
  notStarted: {
    label: 'Not Started',
    color: 'hsl(var(--chart-4))',
  },
  inProgress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-5))',
  },
  overdue: {
    label: 'Overdue',
    color: 'hsl(0, 70%, 50%)',
  },
} satisfies ChartConfig;

interface TrendChartProps {
  chartData: TrendChartData[];
}

export function ProjectTrendChart({ chartData }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Projects Over Time</CardTitle>
        <CardDescription className="text-xs">
          Showing total projects for this year
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
              dataKey="completed"
              type="natural"
              fill="var(--color-completed)"
              fillOpacity={0.4}
              stroke="var(--color-completed)"
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
              dataKey="pending"
              type="natural"
              fill="var(--color-pending)"
              fillOpacity={0.4}
              stroke="var(--color-pending)"
              stackId="a"
            />
            <Area
              dataKey="inProgress"
              type="natural"
              fill="var(--color-inProgress)"
              fillOpacity={0.4}
              stroke="var(--color-inProgress)"
              stackId="a"
            />
            <Area
              dataKey="notStarted"
              type="natural"
              fill="var(--color-notStarted)"
              fillOpacity={0.4}
              stroke="var(--color-notStarted)"
              stackId="a"
            />
            <Area
              dataKey="overdue"
              type="natural"
              fill="hsl(0, 70%, 50%)"
              fillOpacity={0.4}
              stroke="var(--color-overdue)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
