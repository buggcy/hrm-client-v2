'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { HrStatsPendingRequests } from '@/libs/validations/hr-dashboard';

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  employee: {
    label: 'Employee',
    color: 'hsl(var(--chart-1))',
  },
  leave: {
    label: 'Leave',
    color: 'hsl(var(--chart-2))',
  },
  perk: {
    label: 'Perk',
    color: 'hsl(var(--chart-5))',
  },
  resignation: {
    label: 'Resignation',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface RequestDistributionProps {
  data?: HrStatsPendingRequests;
}

export function RequestDistribution({ data }: RequestDistributionProps) {
  const chartData = [
    {
      month: 'january',
      employee: data?.employee || 0,
      leave: data?.leave || 0,
      perk: data?.perk || 0,
      resignation: data?.resignation || 0,
    },
  ];
  const totalRequests =
    chartData[0].employee +
    chartData[0].leave +
    chartData[0].perk +
    chartData[0].resignation;

  return (
    <Card className="col-span-1 flex min-h-[250px] flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Pending Requests</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-between pb-0">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <p>
              <span className="font-bold">
                {data?.employee.toLocaleString() || 0}
              </span>{' '}
              Employee
            </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <p>
              <span className="font-bold">
                {data?.leave.toLocaleString() || 0}
              </span>{' '}
              Leave
            </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-5))]"></div>
            <p>
              <span className="font-bold">
                {data?.perk.toLocaleString() || 0}
              </span>{' '}
              Perk
            </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
            <p>
              <span className="font-bold">
                {data?.resignation.toLocaleString() || 0}
              </span>{' '}
              Resignation
            </p>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-[200px]"
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
                          Requests
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="employee"
              stackId="a"
              fill="var(--color-employee)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="leave"
              fill="var(--color-leave)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="perk"
              fill="var(--color-perk)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="resignation"
              fill="var(--color-resignation)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
