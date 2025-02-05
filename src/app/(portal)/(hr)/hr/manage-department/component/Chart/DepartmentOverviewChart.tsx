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

import { DepartmentOverviewChartType } from '@/libs/validations/project-department';

export const description = 'A stacked bar chart with a legend';

const chartConfig = {
  projects: {
    label: 'Projects',
    color: 'hsl(var(--chart-1))',
  },
  deletedEmployees: {
    label: 'Removed Employees',
    color: 'hsl(var(--chart-3))',
  },
  deleteProjects: {
    label: 'Removed Projects',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

interface ChartProps {
  chartData?: DepartmentOverviewChartType[];
}

export function DepartmentOverviewChat({ chartData }: ChartProps) {
  return (
    <Card className="col-span-2 h-fit max-h-[385px]">
      <CardHeader>
        <CardTitle>Department Statistics</CardTitle>
        <CardDescription className="text-sm">
          Showing removed employees and projects, and total projects for each
          department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto size-full max-h-[280px] min-h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="projects"
                stackId="a"
                fill="var(--color-projects)"
                barSize={40}
              />
              <Bar
                dataKey="deleteProjects"
                stackId="a"
                fill="var(--color-deleteProjects)"
                radius={[0, 0, 0, 0]}
                barSize={40}
              />
              <Bar
                dataKey="deletedEmployees"
                stackId="a"
                fill="var(--color-deletedEmployees)"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
