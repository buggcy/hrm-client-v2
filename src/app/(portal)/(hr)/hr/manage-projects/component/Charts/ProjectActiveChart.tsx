'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  active: {
    label: 'Active',
    color: 'hsl(var(--chart-1))',
  },

  inactive: {
    label: 'Inactive',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;
interface RecordChartProps {
  activeCount?: number;
  inactiveCount?: number;
  totalCount?: number;
}
export function ProjectActiveRecordChart({
  activeCount,
  inactiveCount,
  totalCount,
}: RecordChartProps) {
  const chartData = [
    {
      month: 'january',
      active: activeCount,
      inactive: inactiveCount,
    },
  ];
  const totalVisitors = totalCount || 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm">Project Records</CardTitle>
      </CardHeader>
      <CardContent className="flex size-full flex-col">
        <div className="flex size-full items-center justify-between">
          <div className="flex flex-col gap-4 text-nowrap">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <p className="font-semibold">
                {activeCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Active
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="font-semibold">
                {inactiveCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Inactive
                </span>
              </p>
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="ml-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius={60}
              outerRadius={90}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="active"
                stackId="a"
                fill="var(--color-active)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="inactive"
                fill="var(--color-inactive)"
                stackId="a"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
