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
  chartData?: PayrollTrendChart[];
}

export function MonthlyPayrollTrendChart({
  chartData,
}: PayrollTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">
          Monthly Payroll Statistics
        </CardTitle>
        <CardDescription className="text-sm">
          Showing total for this year
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
              dataKey="Total_Remaining_Minutes"
              type="natural"
              fill="var(--color-Total_Remaining_Minutes)"
              fillOpacity={0.4}
              stroke="var(--color-Total_Remaining_Minutes)"
              stackId="a"
            />
            <Area
              dataKey="Total_Working_Minutes"
              type="natural"
              fill="var(--color-Total_Working_Minutes)"
              fillOpacity={0.4}
              stroke="var(--color-Total_Working_Minutes)"
              stackId="a"
            />
            <Area
              dataKey="Total_Absent_Deduction"
              type="natural"
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
