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

import { PayrollTrendChart } from '@/types/hr-payroll.types';

export const description = 'A stacked area chart';

const chartConfig = {
  Total_Working_Minutes: {
    label: 'Working Minutes',
    color: 'hsl(var(--chart-1))',
  },
  Total_Remaining_Minutes: {
    label: 'Remaining Minutes',
    color: 'hsl(var(--chart-2))',
  },
  Total_Absent_Deduction: {
    label: 'Absent Deduction',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface PayrollTrendChartProps {
  chartData: PayrollTrendChart[];
}

export function MonthlyPayrollTrendChart({
  chartData,
}: PayrollTrendChartProps) {
  const allMonths = [
    {
      month: 'January',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'February',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'March',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'April',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'May',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'June',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'July',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'August',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'September',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'October',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'November',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
    {
      month: 'December',
      Total_Working_Minutes: 0,
      Total_Remaining_Minutes: 0,
      Total_Absent_Deduction: 0,
    },
  ];
  const currentMonthIndex = new Date().getMonth();

  const rotatedMonths = [
    ...allMonths.slice(currentMonthIndex + 1),
    ...allMonths.slice(0, currentMonthIndex + 1),
  ];
  const monthIndexMap: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  if (chartData && Array.isArray(chartData)) {
    chartData.forEach((item: PayrollTrendChart) => {
      if (!item?.month) return;

      const itemMonthIndex = monthIndexMap[item.month];
      if (itemMonthIndex === undefined) return;

      const rotatedIndex = (itemMonthIndex - (currentMonthIndex + 1) + 12) % 12;

      if (rotatedMonths[rotatedIndex]) {
        rotatedMonths[rotatedIndex].Total_Working_Minutes +=
          item.Total_Working_Minutes || 0;
        rotatedMonths[rotatedIndex].Total_Remaining_Minutes +=
          item.Total_Remaining_Minutes || 0;
        rotatedMonths[rotatedIndex].Total_Absent_Deduction +=
          item.Total_Absent_Deduction || 0;
      }
    });
  }

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle className="font-semibold">
          Monthly Payroll Statistics
        </CardTitle>
        <CardDescription className="text-sm">
          Showing total for this year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[270px] w-full lg:max-h-full lg:min-h-[270px]"
        >
          <AreaChart
            accessibilityLayer
            data={rotatedMonths}
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
              dataKey="Total_Remaining_Minutes"
              type="monotone"
              fill="var(--color-Total_Remaining_Minutes)"
              fillOpacity={0.4}
              stroke="var(--color-Total_Remaining_Minutes)"
              stackId="a"
            />
            <Area
              dataKey="Total_Working_Minutes"
              type="monotone"
              fill="var(--color-Total_Working_Minutes)"
              fillOpacity={0.4}
              stroke="var(--color-Total_Working_Minutes)"
              stackId="a"
            />
            <Area
              dataKey="Total_Absent_Deduction"
              type="monotone"
              fill="var(--color-Total_Absent_Deduction)"
              fillOpacity={0.4}
              stroke="var(--color-Total_Absent_Deduction)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
