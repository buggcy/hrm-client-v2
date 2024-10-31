'use client';

import * as React from 'react';

import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A donut chart with text';

const chartData = [
  { employee: 'intern', count: 275, fill: 'var(--color-intern)' },
  { employee: 'probational', count: 200, fill: 'var(--color-probational)' },
  { employee: 'fullTime', count: 287, fill: 'var(--color-fullTime)' },
];

const chartConfig = {
  count: {
    label: 'Count',
  },
  intern: {
    label: 'Intern',
    color: 'hsl(var(--chart-5))',
  },
  probational: {
    label: 'Probational',
    color: 'hsl(var(--chart-2))',
  },
  fullTime: {
    label: 'FullTime',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function EmployeeDistribution() {
  const totalEmployees = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className="flex min-h-[250px] flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Employees</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-row items-center justify-between pb-0">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <p>
              <span className="font-bold">275</span> Full Time
            </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <p>
              <span className="font-bold">200</span> Probational
            </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-5))]"></div>
            <p>
              <span className="font-bold">287</span> Intern
            </p>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="employee"
              innerRadius={50}
              outerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 4}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEmployees.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Employees
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
