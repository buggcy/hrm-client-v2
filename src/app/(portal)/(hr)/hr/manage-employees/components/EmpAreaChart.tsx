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

import { EmployeeChart } from '@/services/hr/employee.service';

export const description =
  'An area chart showing employee changes (Add, Resign, Fired)';

const chartConfig = {
  added: {
    label: 'Added',
    color: 'hsl(var(--chart-1))',
  },
  resigned: {
    label: 'Resigned',
    color: 'hsl(var(--chart-2))',
  },
  fired: {
    label: 'Fired',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;
interface EmployeeChartProps {
  chartData: EmployeeChart[];
}
export function EmpAreaChart({ chartData }: EmployeeChartProps) {
  return (
    <Card className="h-[330px] w-full max-lg:w-full">
      <CardHeader>
        <CardTitle>Employee Changes</CardTitle>
        <CardDescription>
          Showing added, resigned, and fired employees for the year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="added"
              type="monotone"
              fill="var(--color-added)"
              fillOpacity={0.4}
              stroke="var(--color-added)"
              stackId="a"
            />
            <Area
              dataKey="resigned"
              type="monotone"
              fill="var(--color-resigned)"
              fillOpacity={0.4}
              stroke="var(--color-resigned)"
              stackId="a"
            />
            <Area
              dataKey="fired"
              type="monotone"
              fill="var(--color-fired)"
              fillOpacity={0.4}
              stroke="var(--color-fired)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
