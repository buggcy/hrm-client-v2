'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
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

import { cn } from '@/utils';
export const description = 'A radial chart with stacked sections';

const chartConfig = {
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

export interface Card2Data {
  data?: {
    intern: number;
    probational: number;
    fullTime: number;
  };
}

export function EmpRedicalChart({ data }: Card2Data) {
  const defaultData = {
    intern: 0,
    probational: 0,
    fullTime: 0,
  };

  const chartData = [
    {
      name: 'Status',
      probational: data?.probational || defaultData.probational,
      intern: data?.intern || defaultData.intern,
      fullTime: data?.fullTime || defaultData.fullTime,
    },
  ];

  const total =
    (data?.intern || 0) + (data?.probational || 0) + (data?.fullTime || 0);

  return (
    <Card className="flex h-[330px] w-[27%] flex-col gap-5 max-lg:w-full">
      <CardHeader className={cn('items-left')}>
        <CardTitle>Employee Status </CardTitle>
        <CardDescription>Employee Status Overview</CardDescription>
      </CardHeader>
      <hr className="mx-auto w-10/12 border-gray-300 dark:border-gray-600" />{' '}
      <div className="flex flex-row-reverse items-center">
        <CardContent className="flex flex-1 items-center p-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[200px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={360}
              innerRadius={50}
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
                            y={(viewBox.cy || 0) - 0}
                            className="fill-foreground text-xl font-bold"
                          >
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="fill-muted-foreground text-[11px]"
                          >
                            Applications
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="intern"
                stackId="a"
                fill="var(--color-intern)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="probational"
                stackId="a"
                fill="var(--color-probational)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="fullTime"
                stackId="a"
                fill="var(--color-fullTime)"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 p-0 pl-6 text-sm">
          <div className="flex flex-col gap-3 leading-none text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="text-[12px]">
                Probational: {data?.probational || 0}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-5))]"></div>
              <p className="text-[12px]">Internee: {data?.intern || 0}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <p className="text-[12px]">Full Time: {data?.fullTime || 0}</p>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
