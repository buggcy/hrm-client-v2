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
    color: 'hsl(var(--chart-5))',
  },
  deletedEmployees: {
    label: 'Removed Employees',
    color: 'hsl(var(--chart-4))',
  },
  deleteProjects: {
    label: 'Removed Projects',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface ChartProps {
  chartData?: DepartmentOverviewChartType[];
}

export function DepartmentOverviewChat({ chartData }: ChartProps) {
  return (
    <Card className="col-span-2 h-fit max-h-[385px]">
      <CardHeader>
        <CardTitle className="text-sm">Department Statistics</CardTitle>
        <CardDescription className="text-xs">
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
                tickFormatter={value => value.slice(0, 6)}
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
