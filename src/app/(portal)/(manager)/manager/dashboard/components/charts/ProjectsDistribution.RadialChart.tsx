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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { cn } from '@/utils';

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  complete: {
    label: 'Complete',
    color: 'hsl(var(--chart-1))',
  },
  inProgress: {
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
} satisfies ChartConfig;

const mockData = {
  complete: ['Project A', 'Project B', 'Project C', 'Project D', 'Project E'],
  inProgress: ['Project F', 'Project G', 'Project H', 'Project I', 'Project J'],
  pending: ['Project K', 'Project L', 'Project M', 'Project N', 'Project O'],
  overdue: ['Project P', 'Project Q', 'Project R', 'Project S', 'Project T'],
  cancelled: ['Project U', 'Project V', 'Project W', 'Project X', 'Project Y'],
};

export function ProjectDistribution() {
  const chartData = [
    {
      month: 'january',
      inProgress: 100,
      overdue: 50,
      complete: 20,
      cancelled: 10,
      pending: 10,
    },
  ];
  const totalRequests =
    chartData.reduce(
      (acc, { inProgress, overdue, complete, cancelled, pending }) =>
        acc + inProgress + overdue + complete + cancelled + pending,
      0,
    ) || 1;

  const categories = Object.keys(mockData) as Array<keyof typeof mockData>;

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
          {categories.map(category => (
            <HoverCard key={category} openDelay={100} closeDelay={100}>
              <HoverCardTrigger>
                <div className="flex flex-row items-center gap-1">
                  <div
                    className={cn(
                      `size-2 rounded-full bg-[hsl(var(--chart-${chartConfig[
                        category
                      ].color.slice(16, 17)}))]`,
                    )}
                  ></div>
                  <p className="hover:underline">
                    <span className="font-bold">
                      {chartData[0][category].toLocaleString() || 0}
                    </span>{' '}
                    {chartConfig[category].label}
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                <ul className="mb-2">
                  {mockData[category].map((project, index) => (
                    <li key={index} className="text-sm">
                      {project}
                    </li>
                  ))}
                </ul>
                <Button variant="link" className="text-xs">
                  See more
                </Button>
              </HoverCardContent>
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
            <RadialBar
              dataKey="complete"
              fill="var(--color-complete)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="inProgress"
              stackId="a"
              fill="var(--color-inProgress)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="pending"
              fill="var(--color-pending)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="overdue"
              fill="var(--color-overdue)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="cancelled"
              fill="var(--color-cancelled)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
