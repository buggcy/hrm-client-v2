'use client';

import { TrendingUp } from 'lucide-react';
import { LabelList, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A radial chart with a label';

const chartData = [
  { day: '', productivity: 100, fill: 'var(--color-other)' },
  { day: 'Monday', productivity: 79, fill: 'var(--color-Monday)' },
  { day: 'Tuesday', productivity: 60, fill: 'var(--color-Tuesday)' },
  { day: 'Wednesday', productivity: 71, fill: 'var(--color-Wednesday)' },
  { day: 'Thursday', productivity: 76, fill: 'var(--color-Thursday)' },
  { day: 'Friday', productivity: 85, fill: 'var(--color-Friday)' },
];

const chartConfig = {
  productivity: {
    label: 'Productivity',
  },
  Monday: {
    label: 'Monday',
    color: 'hsl(var(--chart-1))',
  },
  Tuesday: {
    label: 'Tuesday',
    color: 'hsl(var(--chart-2))',
  },
  Wednesday: {
    label: 'Wednesday',
    color: 'hsl(var(--chart-3))',
  },
  Thursday: {
    label: 'Thursday',
    color: 'hsl(var(--chart-4))',
  },
  Friday: {
    label: 'Friday',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function EmployeeProductivity() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Employee Productivity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="day" />}
            />
            <RadialBar dataKey="productivity" background>
              <LabelList
                position="insideStart"
                dataKey="day"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this week <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average productivity for the week
        </div>
      </CardFooter>
    </Card>
  );
}
