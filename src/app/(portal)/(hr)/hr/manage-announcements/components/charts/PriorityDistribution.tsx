'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { priorityStats } from '@/libs/validations/hr-announcements';

export const description = 'A pie chart with a label';

const chartConfig = {
  employee: {
    label: 'Employee',
  },
  high: {
    label: 'high',
    color: 'hsl(var(--chart-3))',
  },
  medium: {
    label: 'medium',
    color: 'hsl(var(--chart-2))',
  },
  low: {
    label: 'low',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface PriorityDistributionProps {
  data?: priorityStats;
}

export function PriorityDistribution({ data }: PriorityDistributionProps) {
  const chartData = [
    {
      priority: 'low',
      status: data?.low || 0,
      fill: 'var(--color-low)',
    },
    {
      priority: 'medium',
      status: data?.medium || 0,
      fill: 'var(--color-medium)',
    },
    {
      priority: 'high',
      status: data?.high || 0,
      fill: 'var(--color-high)',
    },
  ];
  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="items-center">
        <CardTitle className="pb-4 text-base">Announcements Overview</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px] pb-2 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie data={chartData} dataKey="status" label nameKey="priority" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
