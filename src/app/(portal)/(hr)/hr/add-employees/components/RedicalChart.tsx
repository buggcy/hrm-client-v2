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
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-4))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-3))',
  },
  tba: {
    label: 'TBA',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export interface Card2Data {
  data?: {
    pending: number;
    tba: number;
    rejected: number;
    approved: number;
  };
}

export function RedicalChart({ data }: Card2Data) {
  const defaultData = {
    pending: 0,
    tba: 0,
    rejected: 0,
    approved: 0,
  };

  const chartData = [
    {
      name: 'Status',
      Pending: data?.pending || defaultData.pending,
      rejected: data?.rejected || defaultData.rejected,
      tba: data?.tba || defaultData.tba,
    },
  ];

  const total = (data?.pending || 0) + (data?.rejected || 0) + (data?.tba || 0);

  return (
    <Card className="flex h-[330px] w-[27%] flex-col gap-5 max-lg:w-full">
      <CardHeader className={cn('items-left')}>
        <CardTitle>Status Overview</CardTitle>
        <CardDescription>Applicants Status Overview</CardDescription>
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
                dataKey="Pending"
                stackId="a"
                fill="var(--color-pending)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="rejected"
                stackId="a"
                fill="var(--color-rejected)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="tba"
                stackId="a"
                fill="var(--color-tba)"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 p-0 pl-6 text-sm">
          <div className="flex flex-col gap-3 leading-none text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-4))]"></div>
              <p className="text-[12px]">Pending: {data?.pending || 0}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="text-[12px]">Rejected: {data?.rejected || 0}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="text-[12px]">TBA: {data?.tba || 0}</p>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
