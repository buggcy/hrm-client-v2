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
}: AttendanceHistoryBarChartProps) {
  const formatDate = (date?: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const today = new Date();
  const last7Days = Array.from({ length: 7 })
    .map((_, index) => {
      const day = new Date();
      day.setDate(today.getDate() - index);
      return {
        date: day,
        dayName: day.toLocaleDateString('en-US', { weekday: 'long' }),
      };
    })
    .reverse();

  const formattedDateRange = `${formatDate(last7Days[0].date)} - ${formatDate(
    last7Days[last7Days.length - 1].date,
  )}`;

  const chartData = last7Days.map(dayInfo => ({
    day: dayInfo.dayName,
    present: data?.[dayInfo.dayName]?.Present || 0,
    absent: data?.[dayInfo.dayName]?.Absent || 0,
    leave: data?.[dayInfo.dayName]?.Leave || 0,
  }));

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription className="text-xs">
          {formattedDateRange}
        </CardDescription>
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
              radius={[0, 0, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
