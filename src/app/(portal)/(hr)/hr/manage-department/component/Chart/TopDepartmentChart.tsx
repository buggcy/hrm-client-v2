'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { DepartmentTopChartType } from '@/libs/validations/project-department';

export const description = 'A bar chart with a custom label';

const chartConfig = {
  employees: {
    label: 'Employees',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;
interface ChartProps {
  chartData?: DepartmentTopChartType[];
}
export function TopDepartmentChart({ chartData }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Top Departments</CardTitle>
        <CardDescription className="text-xs">
          No. of Employees in Each Department
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto size-full max-h-[280px] min-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="department"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="employees" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="employees"
                layout="vertical"
                fill="var(--color-employees)"
                radius={4}
              >
                <LabelList
                  dataKey="department"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="employees"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
