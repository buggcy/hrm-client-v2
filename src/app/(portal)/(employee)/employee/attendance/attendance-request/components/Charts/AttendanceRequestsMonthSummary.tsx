'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

import { MonthsSummary } from '@/libs/validations/attendance-request';

const chartConfig = {
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-1))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-3))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface AttendanceRequestsMonthSummaryProps {
  data?: MonthsSummary[];
}

export function AttendanceRequestsMonthSummary({
  data,
}: AttendanceRequestsMonthSummaryProps) {
  const chartData = data?.map(({ date, approved, pending, rejected }) => ({
    date,
    approved,
    pending,
    rejected,
  }));
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>Requests Summary</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <ChartContainer
          config={chartConfig}
          className="size-full min-h-[200px]"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => {
                const year: number = Number(value.split('-')[0]);
                const month: number = Number(value.split('-')[1]);
                return new Date(year, month - 1).toLocaleDateString('en-US', {
                  month: 'short',
                  year: '2-digit',
                });
              }}
            />

            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="approved"
              stackId="a"
              fill="var(--color-approved)"
              radius={[0, 0, 4, 4]}
              strokeWidth={0.5}
              barSize={20}
            />
            <Bar
              dataKey="rejected"
              stackId="a"
              fill="var(--color-rejected)"
              radius={[0, 0, 0, 0]}
              strokeWidth={0.5}
              barSize={20}
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="var(--color-pending)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
