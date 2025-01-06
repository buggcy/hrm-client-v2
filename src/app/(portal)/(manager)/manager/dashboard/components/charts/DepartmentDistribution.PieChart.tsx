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

export const description = 'A bar chart with a custom label';

const chartData = [
  { department: 'UI/UX', employees: 186 },
  { department: 'Finance', employees: 305 },
  { department: 'MERN Stack', employees: 237 },
  { department: 'Wordpress', employees: 73 },
  { department: 'App Development', employees: 209 },
  { department: 'Accounting', employees: 214 },
  { department: 'HR', employees: 214 },
  { department: 'Marketing', employees: 214 },
  { department: 'Sales', employees: 214 },
  { department: 'Customer Support', employees: 214 },
];

const chartConfig = {
  employees: {
    label: 'Employees',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;

export function DepartmentPieChart() {
  return (
    <Card className="col-span-1 flex size-full flex-col justify-between md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Departments</CardTitle>
        <CardDescription>No. of Employees in Each Department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto size-full max-h-[350px] min-h-[290px]"
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
