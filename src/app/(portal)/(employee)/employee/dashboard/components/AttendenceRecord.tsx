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

export const description = 'A donut chart with text';

const chartConfig = {
  count: {
    label: 'Count',
  },

  present: {
    label: 'Present',
    color: 'hsl(var(--chart-1))',
  },
  leave: {
    label: 'Leave',
    color: 'hsl(var(--chart-2))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface EmployeeDistributionProps {
  noOfPresents: number;
  noOfLeaves: number;
  noOfAbsents: number;
}

export function EmployeeAttendenceCard({
  noOfAbsents,
  noOfPresents,
  noOfLeaves,
}: EmployeeDistributionProps) {
  const chartData = React.useMemo(
    () => [
      {
        employee: 'absent',
        count: noOfAbsents || 0,
        fill: 'var(--color-absent)',
      },
      {
        employee: 'present',
        count: noOfPresents || 0,
        fill: 'var(--color-present)',
      },
      {
        employee: 'leave',
        count: noOfLeaves || 0,
        fill: 'var(--color-leave)',
      },
    ],
    [noOfAbsents, noOfLeaves, noOfPresents],
  );
  const totalEmployees = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="rounded-lg p-0 dark:bg-zinc-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg dark:text-white">
            Attendance Records
          </CardTitle>
          <Link
            href="/employee/attendance/leave-history"
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            View Stats
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <hr className="mb-1 mt-0 border-gray-200 dark:border-gray-700" />
        <div className="flex items-center justify-between">
          <div className="mb-2 flex flex-col gap-5 text-sm">
            <div className="flex flex-row items-center gap-1">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                <span className="font-bold text-black dark:text-gray-300">
                  {noOfPresents || 0}
                </span>{' '}
                Total Presents
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                <span className="font-bold text-black dark:text-gray-300">
                  {noOfAbsents || 0}
                </span>{' '}
                Total Absents
              </p>
            </div>

            <div className="flex flex-row items-center gap-1">
              <div className="size-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                <span className="font-bold text-black dark:text-gray-300">
                  {noOfLeaves || 0}
                </span>{' '}
                Total Leaves
              </p>
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-square w-full max-w-[150px]"
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
                innerRadius={45}
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
                            y={(viewBox.cy || 0) - 1}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalEmployees.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          ></tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
