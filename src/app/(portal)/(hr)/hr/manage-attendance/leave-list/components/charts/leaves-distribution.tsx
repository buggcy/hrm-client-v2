'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { LeaveListRecords } from '@/types/hr-leave-list.types';

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-1))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-3))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;
interface LeaveListRecordChartProps {
  data: LeaveListRecords | undefined;
}
export function LeavesDistributionChart({ data }: LeaveListRecordChartProps) {
  const chartData = [
    {
      month: 'january',
      pending: data?.pendingCount,
      approved: data?.approvedCount,
      rejected: data?.rejectedCount,
      cancelled: data?.canceledCount,
    },
  ];
  const totalVisitors = data?.totalCount || 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Leave Requests</CardTitle>
      </CardHeader>
      <CardContent className="flex size-full flex-col">
        <div className="flex size-full items-center justify-between">
          <div className="flex flex-col gap-4 text-nowrap">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <p className="font-semibold">
                {data?.approvedCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Approved
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="font-semibold">
                {data?.pendingCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Pending
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="font-semibold">
                {data?.rejectedCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Rejected
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-4))]"></div>
              <p className="font-semibold">
                {data?.canceledCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Cancelled
                </span>
              </p>
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="ml-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius={60}
              outerRadius={90}
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
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Requests
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
                dataKey="cancelled"
                fill="var(--color-cancelled)"
                stackId="a"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="pending"
                fill="var(--color-pending)"
                stackId="a"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
        <Button disabled>Approve All</Button>
      </CardContent>
    </Card>
  );
}
