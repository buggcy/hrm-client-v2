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

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function Leave({ totalTakenLeaves, totalAllowedLeaves }) {
  const chartData = [
    {
      browser: 'safari',
      visitors: totalTakenLeaves,
      fill: 'var(--color-safari)',
    },
  ];
  const percentage = totalTakenLeaves / totalAllowedLeaves;
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[100px] min-h-[90px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270 * percentage}
        innerRadius={40}
        outerRadius={55}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[42, 38]}
        />
        <RadialBar dataKey="visitors" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                    >
                      {chartData[0].visitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 16}
                      className="fill-muted-foreground text-xs"
                    >
                      {totalAllowedLeaves.toLocaleString()}
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
