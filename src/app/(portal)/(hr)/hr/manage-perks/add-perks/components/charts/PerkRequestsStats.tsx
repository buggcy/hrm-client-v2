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

import { HrPerkChartData } from '@/types/hr-perks-list.types';

export const description = 'A stacked area chart';
interface PerkRecordChartProps {
  chartData: HrPerkChartData[] | undefined;
}

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

export function PerkRequests({ chartData }: PerkRecordChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Perk Assigned & Availed</CardTitle>
        <CardDescription className="text-xs">
          Showing total assigned & availed for this year
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
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
