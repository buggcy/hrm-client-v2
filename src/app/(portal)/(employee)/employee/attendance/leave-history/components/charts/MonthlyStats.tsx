'use client';

import React, { FunctionComponent } from 'react';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { monthCount } from '@/types/leave-history.types';

export const description = 'A bar chart';

const chartConfig = {
  leaves: {
    label: 'Leaves',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface MothlyStatsProps {
  data: monthCount | undefined;
}

const MonthlyStats: FunctionComponent<MothlyStatsProps> = ({ data }) => {
  const chartData = [
    { month: 'January', leaves: data?.January || 0 },
    { month: 'February', leaves: data?.February || 0 },
    { month: 'March', leaves: data?.March || 0 },
    { month: 'April', leaves: data?.April || 0 },
    { month: 'May', leaves: data?.May || 0 },
    { month: 'June', leaves: data?.June || 0 },
    { month: 'July', leaves: data?.July || 0 },
    { month: 'August', leaves: data?.August || 0 },
    { month: 'September', leaves: data?.September || 0 },
    { month: 'October', leaves: data?.October || 0 },
    { month: 'November', leaves: data?.November || 0 },
    { month: 'December', leaves: data?.December || 0 },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Stats</CardTitle>
      </CardHeader>
      <CardContent className="h-full grow">
        <ChartContainer
          config={chartConfig}
          className="h-5/6 min-h-[100px] w-full lg:h-3/4"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              width={10}
              tickMargin={10}
              tick={{ fontSize: 9 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickCount={5}
              width={20}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="leaves"
              fill="var(--color-leaves)"
              radius={4}
              barSize={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyStats;
