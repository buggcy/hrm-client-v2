'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A pie chart with a label';

const chartConfig = {
  project: {
    label: 'Project',
  },
  active: {
    label: 'Active',
    color: 'hsl(var(--chart-5))',
  },

  inactive: {
    label: 'Inactive',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface PriorityDistributionProps {
  activeCount?: number;
  inactiveCount?: number;
}

export function ProjectPieChart({
  activeCount,
  inactiveCount,
}: PriorityDistributionProps) {
  const chartData = [
    {
      priority: 'active',
      status: activeCount || 0,
      fill: 'var(--color-active)',
    },
    {
      priority: 'inactive',
      status: inactiveCount || 0,
      fill: 'var(--color-inactive)',
    },
  ];
  return (
    <Card className="flex w-full flex-col">
      <CardHeader>
        <CardTitle className="pb-4">Project Overview</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px] pb-2 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="status" label nameKey="priority" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
