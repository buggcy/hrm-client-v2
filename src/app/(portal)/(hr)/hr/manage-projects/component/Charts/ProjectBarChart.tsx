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

import { ProjectChartType } from '@/libs/validations/project-department';

export const description = 'A stacked bar chart with a legend';

const chartConfig = {
  deletedMembers: {
    label: 'Remove Members',
    color: 'hsl(var(--chart-3))',
  },
  team: {
    label: 'Team Members',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface ChartProps {
  chartData?: ProjectChartType[];
}

export function ProjectBarChat({ chartData }: ChartProps) {
  return (
    <Card className="col-span-1 h-full md:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm">Project Members Statistics</CardTitle>
        <CardDescription className="text-xs">
          Showing team and remove members for each projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto size-full max-h-[230px] min-h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="projectName"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 6)}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="team"
                stackId="a"
                fill="var(--color-team)"
                radius={[0, 0, 4, 4]}
                barSize={40}
              />
              <Bar
                dataKey="deletedMembers"
                stackId="a"
                fill="var(--color-deletedMembers)"
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
