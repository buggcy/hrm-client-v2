'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';

export const description = 'A radial chart with text';

interface HoursCompletedChartProps {
  timeCompleted: number | undefined;
}

export function HoursCompletedChart({
  timeCompleted,
}: HoursCompletedChartProps) {
  const chartData = [
    { name: 'Safari', value: timeCompleted, fill: 'var(--color-safari)' },
  ];
  const color =
    (timeCompleted ?? 0) >= 50 ? 'var(--chart-1)' : 'var(--chart-3)';

  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    safari: {
      label: 'Safari',
      color: `hsl(${color})`,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[200px] min-h-[150px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={((timeCompleted ?? 0) / 100) * -270}
        innerRadius={60}
        outerRadius={80}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[65, 55]}
        />
        <RadialBar dataKey="value" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                const chartLineColor = chartData[0].fill;
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 20}
                      className="fill-foreground text-base font-bold"
                    >
                      {timeCompleted?.toLocaleString()}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      Hours Completed
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 28}
                      fill={chartLineColor}
                      className="font-bold"
                    >
                      {(timeCompleted ?? 0) >= 50 ? 'Good' : 'Poor'}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
