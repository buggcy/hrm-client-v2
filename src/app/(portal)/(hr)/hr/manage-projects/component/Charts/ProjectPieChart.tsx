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

interface PriorityDistributionProps {
  pendingCount?: number;
  completedCount?: number;
  inProgressCount?: number;
  cancelledCount?: number;
  notStartedCount?: number;
  overdueCount?: number;
}

export function ProjectPieChart({
  pendingCount,
  completedCount,
  inProgressCount,
  cancelledCount,
  notStartedCount,
  overdueCount,
}: PriorityDistributionProps) {
  const chartData = [
    {
      priority: 'pending',
      status: pendingCount || 0,
      fill: 'var(--color-pending)',
    },
    {
      priority: 'overdue',
      status: overdueCount || 0,
      fill: 'hsl(0, 70%, 50%)',
    },
    {
      priority: 'inProgress',
      status: inProgressCount || 0,
      fill: 'var(--color-inProgress)',
    },
    {
      priority: 'cancelled',
      status: cancelledCount || 0,
      fill: 'var(--color-cancelled)',
    },
    {
      priority: 'notStarted',
      status: notStartedCount || 0,
      fill: 'var(--color-notStarted)',
    },
    {
      priority: 'completed',
      status: completedCount || 0,
      fill: 'var(--color-completed)',
    },
  ];
  return (
    <Card className="flex w-full flex-col">
      <CardHeader>
        <CardTitle className="pb-4 text-sm">
          Project Status Statistics
        </CardTitle>
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
