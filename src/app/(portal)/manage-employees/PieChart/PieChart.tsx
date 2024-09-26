'use client';

import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { PieChartConfig, PieChartProps } from '../types';

export const description = 'A pie chart with a custom label';

const chartData: PieChartProps['data'] = [
  { browser: 'Active', visitors: 275, fill: 'var(--color-Active)' },
  { browser: 'Inactive', visitors: 200, fill: 'var(--color-Inactive)' },
  { browser: 'OnLeave', visitors: 187, fill: 'var(--color-OnLeave)' },
];

const chartConfig: PieChartConfig = {
  visitors: {
    label: 'Visitors',
  },
  Active: {
    label: 'Active',
    color: '#dae5fc',
  },
  Inactive: {
    label: 'Inactive',
    color: '#fdddf1',
  },
  OnLeave: {
    label: 'OnLeave',
    color: '#e2dbf6',
  },
};

export function PChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardDescription>
          Percentage of Active , Inactive and On-Leave Employee
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {`${
                      chartConfig[payload.browser as keyof typeof chartConfig]
                        ?.label
                    } (${payload.visitors})`}
                  </text>
                );
              }}
              nameKey="browser"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
