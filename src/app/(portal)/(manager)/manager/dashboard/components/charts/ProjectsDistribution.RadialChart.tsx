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
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';

import { ManageProjectStatsType } from '@/libs/validations/manager-dashboard';
import { cn } from '@/utils';

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-1))',
  },
  inprogress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-2))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-5))',
  },
  overdue: {
    label: 'Overdue',
    color: 'hsl(var(--chart-3))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-4))',
  },
  notstarted: {
    label: 'Not Started',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function ProjectDistribution({
  projectStats,
}: {
  projectStats: ManageProjectStatsType[] | undefined;
}) {
  const defaultStats = {
    completed: 0,
    inprogress: 0,
    pending: 0,
    overdue: 0,
    cancelled: 0,
    notstarted: 0,
  };

  const mappedStats =
    projectStats?.reduce(
      (acc, { status, count }) => {
        const key = status
          .toLowerCase()
          .replace(/\s+/g, '') as keyof typeof defaultStats;

        if (key in defaultStats) {
          acc[key] = count;
        }
        return acc;
      },
      { ...defaultStats },
    ) || defaultStats;

  // Prepare chart data
  const chartData = [
    {
      ...mappedStats,
    },
  ];

  // Total number of projects
  const totalRequests =
    Object.values(mappedStats).reduce((acc, count) => acc + count, 0) || 1;

  return (
    <Card className="col-span-1 flex flex-col">
      <CardHeader className="-mb-4 flex flex-row items-center justify-between pb-2 sm:pb-0">
        <CardTitle>Projects Overview</CardTitle>
        <Button variant="link" className="mb-1.5">
          More Details
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-row items-center justify-between">
        <div className="flex flex-col gap-2 text-nowrap text-sm">
          {Object.keys(chartConfig).map(category => (
            <HoverCard key={category} openDelay={100} closeDelay={100}>
              <HoverCardTrigger>
                <div className="flex flex-row items-center gap-1">
                  <div
                    style={{
                      backgroundColor:
                        chartConfig[category as keyof typeof chartConfig].color,
                    }}
                    className={cn(`size-2 rounded-full`)}
                  ></div>
                  <p className="hover:underline">
                    <span className="font-bold">
                      {chartData[0][
                        category as keyof (typeof chartData)[0]
                      ].toLocaleString() || 0}
                    </span>{' '}
                    {chartConfig[category as keyof typeof chartConfig].label}
                  </p>
                </div>
              </HoverCardTrigger>
            </HoverCard>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="-mr-4 aspect-square w-full max-w-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={360}
            innerRadius={60}
            outerRadius={100}
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
                          {totalRequests.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
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
            {Object.keys(chartConfig).map(category => (
              <RadialBar
                key={category}
                dataKey={category}
                fill={chartConfig[category as keyof typeof chartConfig].color}
                stackId="a"
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
