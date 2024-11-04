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

import { HrStatsProductivityData } from '@/libs/validations/hr-dashboard';

export const description = 'A radial chart with a label';

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

interface EmployeeProductivityProps {
  data?: HrStatsProductivityData;
}

export function EmployeeProductivity({ data }: EmployeeProductivityProps) {
  const chartData = [
    {
      day: 'Monday',
      productivity: data?.Monday || 0,
      fill: 'var(--color-Monday)',
    },
    {
      day: 'Tuesday',
      productivity: data?.Tuesday || 0,
      fill: 'var(--color-Tuesday)',
    },
    {
      day: 'Wednesday',
      productivity: data?.Wednesday || 0,
      fill: 'var(--color-Wednesday)',
    },
    {
      day: 'Thursday',
      productivity: data?.Thursday || 0,
      fill: 'var(--color-Thursday)',
    },
    {
      day: 'Friday',
      productivity: data?.Friday || 0,
      fill: 'var(--color-Friday)',
    },
  ];
  return (
    <Card className="col-span-1 flex flex-col">
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
