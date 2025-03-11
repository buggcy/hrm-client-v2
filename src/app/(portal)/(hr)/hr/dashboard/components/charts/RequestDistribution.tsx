'use client';

import * as React from 'react';
import Link from 'next/link';

import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { HrStatsPendingRequests } from '@/libs/validations/hr-dashboard';

export const description = 'A donut chart with text';

const chartConfig = {
  count: {
    label: 'Count',
  },
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
  overtime: {
    label: 'Overtime',
    color: 'hsl(var(--chart-4))',
  },
  attandence: {
    label: 'Attendance',
    color: '#79ade4',
  },
} satisfies ChartConfig;

interface RequestDistributionProps {
  data?: HrStatsPendingRequests;
}

export function RequestDistribution({ data }: RequestDistributionProps) {
  const chartData = React.useMemo(
    () => [
      {
        employee: 'employee',
        count: data?.employee || 0,
        fill: 'hsl(var(--chart-1))',
        link: '/approval',
      },
      {
        employee: 'leave',
        count: data?.leave || 0,
        fill: 'hsl(var(--chart-2))',
        link: '/manage-attendance/leave-requests',
      },
      {
        employee: 'perk',
        count: data?.perk || 0,
        fill: 'hsl(var(--chart-5))',
        link: '/manage-perks/perk-requests',
      },
      {
        employee: 'resignation',
        count: data?.resignation || 0,
        fill: 'hsl(var(--chart-3))',
        link: '/resigned-employees',
      },
      {
        employee: 'overtime',
        count: data?.overtime || 0,
        fill: 'hsl(var(--chart-4))',
        link: '/manage-attendance/overtime-request',
      },
      {
        employee: 'attandence',
        count: data?.attandence || 0,
        fill: '#79ade4',
        link: '/manage-attendance/attendance-requests',
      },
    ],
    [data],
  );
  const totalEmployees = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="col-span-1 flex min-h-[250px] flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Pending Requests</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-row items-center justify-between pb-0">
        <div className="flex flex-col gap-2 text-sm">
          {chartData.map(item => (
            <Link
              key={item.employee}
              className="flex flex-row items-center gap-1"
              href={'/hr' + item?.link}
            >
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              ></div>
              <p className="hover:underline">
                <span className="font-bold">{item.count}</span>{' '}
                {chartConfig[item.employee as keyof typeof chartConfig].label}
              </p>
            </Link>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="employee"
              innerRadius={57}
              outerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 4}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEmployees.toLocaleString()}
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
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
