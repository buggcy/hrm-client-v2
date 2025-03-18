'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { RequestChart } from '@/libs/validations/overtime';

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-1))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-3))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  canceled: {
    label: 'Canceled',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface RequestChartProps {
  data?: RequestChart;
}

export function OvertimeRequestChart({ data }: RequestChartProps) {
  const chartData = [
    {
      month: 'january',
      approved: data?.approvedCount || 0,
      rejected: data?.rejectedCount || 0,
      pending: data?.pendingCount || 0,
      canceled: data?.canceledCount || 0,
    },
  ];

  const totalVisitors = data?.totalCount || 0;

  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <div className="flex items-center justify-between border-b-2 pb-6">
          <CardTitle className="text-lg">Overtime Requests</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between pt-6 sm:gap-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <p className="font-semibold">
              {data?.approvedCount || 0}{' '}
              <span className="text-sm font-medium text-slate-400">
                Approved
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
            <p className="font-semibold">
              {data?.rejectedCount || 0}{' '}
              <span className="text-sm font-medium text-slate-400">
                Rejected
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <p className="font-semibold">
              {data?.pendingCount || 0}{' '}
              <span className="text-sm font-medium text-slate-400">
                Pending
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-4))]"></div>
            <p className="font-semibold">
              {data?.canceledCount || 0}{' '}
              <span className="text-sm font-medium text-slate-400">
                Canceled
              </span>
            </p>
          </div>
        </div>
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
                          {chartData[0].approved + chartData[0].rejected}
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
              dataKey="approved"
              stackId="a"
              fill="var(--color-approved)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="rejected"
              fill="var(--color-rejected)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="pending"
              fill="var(--color-pending)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="canceled"
              fill="var(--color-canceled)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
