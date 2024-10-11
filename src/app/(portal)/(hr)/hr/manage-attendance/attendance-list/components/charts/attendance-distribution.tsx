'use client';

import { Pie, PieChart } from 'recharts';

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

import { Card1Data } from '@/types/attendance-list.types';

export const description = 'A pie chart with a label';

const chartConfig = {
  employee: {
    label: 'Employee',
  },
  present: {
    label: 'Present',
    color: 'hsl(var(--chart-1))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--chart-2))',
  },
  leave: {
    label: 'Leave',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface AttendanceDistributionProps {
  data?: Card1Data;
}

export function AttendanceDistribution({ data }: AttendanceDistributionProps) {
  const chartData = [
    {
      status: 'present',
      employee: data?.totalPresent || 0,
      fill: 'var(--color-present)',
    },
    {
      status: 'absent',
      employee: data?.totalAbsent || 0,
      fill: 'var(--color-absent)',
    },
    {
      status: 'leave',
      employee: data?.totalLeave || 0,
      fill: 'var(--color-leave)',
    },
  ];
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Attendance Today</CardTitle>
        <CardDescription>October 10th, 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie data={chartData} dataKey="employee" label nameKey="status" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
