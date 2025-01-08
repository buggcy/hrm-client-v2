'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
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
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-1))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-3))',
  },
  notStarted: {
    label: 'Not Started',
    color: 'hsl(var(--chart-4))',
  },
  inprogress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-5))',
  },
  overdue: {
    label: 'Overdue',
    color: 'hsl(0, 70%, 50%)',
  },
} satisfies ChartConfig;
interface RecordChartProps {
  pendingCount?: number;
  completedCount?: number;
  inProgressCount?: number;
  cancelledCount?: number;
  notStartedCount?: number;
  overdueCount?: number;
  totalCount?: number;
}
export function ProjectActiveRecordChart({
  pendingCount,
  completedCount,
  inProgressCount,
  cancelledCount,
  notStartedCount,
  overdueCount,
  totalCount,
}: RecordChartProps) {
  const chartData = [
    {
      month: 'january',
      pending: pendingCount,
      completed: completedCount,
      cancelled: cancelledCount,
      notStarted: notStartedCount,
      inprogress: inProgressCount,
      overdue: overdueCount,
    },
  ];
  const totalVisitors = totalCount || 0;

  return (
    <Card className="flex h-[368px] flex-col gap-3">
      <CardHeader className={cn('items-left')}>
        <CardTitle>Project Status </CardTitle>
        <CardDescription className="text-sm">
          Project status Distribution
        </CardDescription>
      </CardHeader>
      <hr className="mx-auto w-10/12 border-gray-300 dark:border-gray-600" />{' '}
      <CardContent className="flex size-full flex-col">
        <div className="flex size-full items-center justify-between">
          <div className="flex flex-col gap-4 text-nowrap">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <p className="font-semibold">
                {completedCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Completed
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="font-semibold">
                {pendingCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Pending
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="font-semibold">
                {cancelledCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  cancelled
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-4))]"></div>
              <p className="font-semibold">
                {notStartedCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  Not Started
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-5))]"></div>
              <p className="font-semibold">
                {inProgressCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  In Progress
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[hsl(0,70%,50%)]"></div>
              <p className="font-semibold">
                {overdueCount}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  overdue
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
                            y={(viewBox.cy || 0) - 6}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 14}
                            className="fill-muted-foreground"
                          >
                            Projects
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="completed"
                stackId="a"
                fill="var(--color-completed)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="pending"
                fill="var(--color-pending)"
                stackId="a"
                className="stroke-transparent stroke-2"
              />

              <RadialBar
                dataKey="cancelled"
                stackId="a"
                fill="var(--color-cancelled)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="notStarted"
                fill="var(--color-notStarted)"
                stackId="a"
                className="stroke-transparent stroke-2"
              />

              <RadialBar
                dataKey="inprogress"
                stackId="a"
                fill="var(--color-inprogress)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="overdue"
                fill="var(--color-overdue)"
                stackId="a"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
