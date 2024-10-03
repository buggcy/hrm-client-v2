'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { Card3Data } from '@/types/attendance-history.types';

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  otci: {
    label: 'On Time Check-ins',
    color: 'hsl(var(--chart-1))',
  },
  lci: {
    label: 'Late Check-ins',
    color: 'hsl(var(--chart-2))',
  },
  leaves: {
    label: 'Leaves',
    color: 'hsl(var(--chart-3))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface AttendanceChartProps {
  data: Card3Data | undefined;
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartData = [
    {
      month: 'january',
      otci: data?.onTimeCheckIns,
      lci: data?.lateCheckIns,
      leaves: data?.leaves,
      absent: data?.absents,
    },
  ];

  const totalVisitors = data?.count || 0;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[200px] min-h-[150px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={60}
        outerRadius={80}
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
                      y={viewBox.cy || 0}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {isNaN(totalVisitors - (data?.absents || 0))
                        ? 0
                        : (
                            totalVisitors - (data?.absents || 0)
                          )?.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 16}
                      className="fill-muted-foreground"
                    >
                      /{totalVisitors?.toLocaleString()}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="otci"
          stackId="a"
          fill="var(--color-otci)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="lci"
          fill="var(--color-lci)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="leaves"
          fill="var(--color-leaves)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="absent"
          fill="var(--color-absent)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
