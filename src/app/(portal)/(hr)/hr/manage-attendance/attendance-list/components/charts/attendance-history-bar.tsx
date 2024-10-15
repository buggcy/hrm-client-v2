'use client';

import { DateRange } from 'react-day-picker';
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

import { Card2Data } from '@/types/attendance-list.types';

export const description = 'A stacked bar chart with a legend';

const chartConfig = {
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

interface AttendanceHistoryBarChartProps {
  data?: Card2Data;
  date?: DateRange;
}

export function AttendanceHistoryBarChart({
  data,
  date,
}: AttendanceHistoryBarChartProps) {
  const formatDate = (date?: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formattedDateRange = date
    ? `${formatDate(date.from)} - ${formatDate(date.to)}`
    : '';

  const chartData = [
    {
      day: 'Monday',
      present: data?.Monday.Present || 0,
      absent: data?.Monday.Absent || 0,
      leave: data?.Monday.Leave || 0,
    },
    {
      day: 'Tuesday',
      present: data?.Tuesday.Present || 0,
      absent: data?.Tuesday.Absent,
      leave: data?.Tuesday.Leave || 0,
    },
    {
      day: 'Wednesday',
      present: data?.Wednesday.Present || 0,
      absent: data?.Wednesday.Absent || 0,
      leave: data?.Wednesday.Leave || 0,
    },
    {
      day: 'Thursday',
      present: data?.Thursday.Present || 0,
      absent: data?.Thursday.Absent || 0,
      leave: data?.Thursday.Leave || 0,
    },
    {
      day: 'Friday',
      present: data?.Friday.Present || 0,
      absent: data?.Friday.Absent || 0,
      leave: data?.Friday.Leave || 0,
    },
    {
      day: 'Saturday',
      present: data?.Saturday.Present || 0,
      absent: data?.Saturday.Absent || 0,
      leave: data?.Saturday.Leave || 0,
    },
    {
      day: 'Sunday',
      present: data?.Sunday.Present || 0,
      absent: data?.Sunday.Absent || 0,
      leave: data?.Sunday.Leave || 0,
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>{formattedDateRange}</CardDescription>
      </CardHeader>
      <CardContent className="md:size-full md:max-h-[310px]">
        <ChartContainer
          config={chartConfig}
          className="size-full max-h-[350px] min-h-[150px] overflow-hidden md:max-h-[310px]"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
