'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

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

import { HrStatsAttendanceData } from '@/libs/validations/hr-dashboard';

export const description = 'A stacked bar chart with a legend';

const chartData = [
  { date: 'Oct 20, 2024', present: 186, absent: 80, leave: 30, late: 20 },
  { date: 'Oct 21, 2024', present: 305, absent: 200, leave: 40, late: 30 },
  { date: 'Oct 22, 2024', present: 237, absent: 120, leave: 15, late: 20 },
  { date: 'Oct 23, 2024', present: 168, absent: 70, leave: 20, late: 10 },
  { date: 'Oct 24, 2024', present: 186, absent: 80, leave: 30, late: 20 },
  { date: 'Oct 25, 2024', present: 305, absent: 200, leave: 40, late: 30 },
  { date: 'Oct 26, 2024', present: 237, absent: 120, leave: 15, late: 20 },
  { date: 'Oct 27, 2024', present: 73, absent: 190, leave: 10, late: 5 },
  { date: 'Oct 28, 2024', present: 209, absent: 130, leave: 25, late: 15 },
  { date: 'Oct 29, 2024', present: 237, absent: 120, leave: 15, late: 20 },
];

const chartConfig = {
  present: {
    label: 'Present',
    color: 'hsl(var(--chart-1))',
  },
  late: {
    label: 'Late',
    color: 'hsl(var(--chart-2))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--chart-3))',
  },
  leave: {
    label: 'Leave',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface AttendanceDistributionProps {
  data?: HrStatsAttendanceData;
}

export function AttendanceDistribution({ data }: AttendanceDistributionProps) {
  return (
    <Card className="col-span-2 h-fit max-h-[385px]">
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>Past 10 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto size-full max-h-[280px] min-h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.reverse() ?? chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 6)}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="present"
                stackId="a"
                fill="var(--color-present)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="late"
                stackId="a"
                fill="var(--color-late)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="absent"
                stackId="a"
                fill="var(--color-absent)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="leave"
                stackId="a"
                fill="var(--color-leave)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
