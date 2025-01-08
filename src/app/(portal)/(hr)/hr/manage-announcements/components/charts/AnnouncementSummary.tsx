'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { statsSummary } from '@/libs/validations/hr-announcements';

export const description = 'A simple area chart';

const chartConfig = {
  high: {
    label: 'High',
    color: 'hsl(var(--chart-3))',
  },
  medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-2))',
  },
  low: {
    label: 'Low',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface EmployeeProductivityChartProps {
  data?: statsSummary;
}

export function AnnouncementSummaryChart({
  data,
}: EmployeeProductivityChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Announcements Summary</CardTitle>
      </CardHeader>
      <CardContent className="md:size-full md:max-h-[310px]">
        <ChartContainer
          config={chartConfig}
          className="size-full max-h-[350px] min-h-[150px] overflow-hidden md:max-h-[310px]"
        >
          <AreaChart
            accessibilityLayer
            data={data}
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
              dataKey="low"
              type="monotone"
              fill="var(--color-low)"
              fillOpacity={0.4}
              stroke="var(--color-low)"
            />
            <Area
              dataKey="medium"
              type="monotone"
              fill="var(--color-medium)"
              fillOpacity={0.4}
              stroke="var(--color-medium)"
            />
            <Area
              dataKey="high"
              type="monotone"
              fill="var(--color-high)"
              fillOpacity={0.4}
              stroke="var(--color-high)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
